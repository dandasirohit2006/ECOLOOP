export interface BuyerProfileData {
  id: string;
  businessName: string;
  category: string;
  city: string;
  preferredCategories?: string[];
  preferredCities?: string[];
  maxBudget?: number | null;
  typicalQuantity?: number | null;
}

export interface MaterialListingData {
  id: string;
  title: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  condition: string;
  locationCity: string;
  locationAddress: string;
  availability: string;
  minOrderQuantity: number;
  sellerId: string;
  seller?: {
    businessName: string;
    city: string;
  };
}

export interface MatchResult {
  matchPercentage: number;
  factors: {
    categoryScore: number;     // max 30
    proximityScore: number;    // max 20
    quantityScore: number;     // max 15
    priceScore: number;        // max 15
    conditionScore: number;    // max 10
    availabilityScore: number; // max 10
  };
  distanceKm: number;
  transportationAdvice: string;
  reasons: string[];
}

// Inter-city distance lookup (approx road km for Eastern/NE India)
const CITY_DISTANCES: Record<string, Record<string, number>> = {
  'Kolkata': { 'Kolkata': 0, 'Howrah': 8, 'Siliguri': 560, 'Guwahati': 980, 'Durgapur': 170, 'Asansol': 210 },
  'Howrah': { 'Kolkata': 8, 'Howrah': 0, 'Siliguri': 565, 'Guwahati': 985, 'Durgapur': 165, 'Asansol': 205 },
  'Siliguri': { 'Kolkata': 560, 'Howrah': 565, 'Siliguri': 0, 'Guwahati': 440, 'Durgapur': 510, 'Asansol': 490 },
  'Guwahati': { 'Kolkata': 980, 'Howrah': 985, 'Siliguri': 440, 'Guwahati': 0, 'Durgapur': 930, 'Asansol': 910 },
  'Durgapur': { 'Kolkata': 170, 'Howrah': 165, 'Siliguri': 510, 'Guwahati': 930, 'Durgapur': 0, 'Asansol': 40 },
  'Asansol': { 'Kolkata': 210, 'Howrah': 205, 'Siliguri': 490, 'Guwahati': 910, 'Durgapur': 40, 'Asansol': 0 },
};

// Synergies between buyer business industry and material waste categories
const INDUSTRY_SYNERGIES: Record<string, string[]> = {
  'Packaging': ['Paper/Cardboard', 'Plastic', 'Wood', 'Packaging materials'],
  'Manufacturing': ['Metal', 'Industrial scrap', 'Plastic', 'Packaging materials', 'Wood'],
  'Textiles': ['Textile', 'Packaging materials'],
  'Recycling': ['Plastic', 'Paper/Cardboard', 'Glass', 'Metal', 'Textile', 'Industrial scrap', 'Food waste'],
  'Food & Beverage': ['Food waste', 'Packaging materials', 'Glass'],
  'Construction': ['Construction materials', 'Wood', 'Metal', 'Industrial scrap'],
  'Retail': ['Packaging materials', 'Paper/Cardboard', 'Furniture', 'Business equipment'],
  'Agriculture': ['Food waste'],
};

export function calculateMatchScore(
  buyer: BuyerProfileData,
  listing: MaterialListingData
): MatchResult {
  const reasons: string[] = [];

  // 1. Material category compatibility (Weight: 30%)
  let rawCategoryRatio = 0.4; // baseline
  const preferredCats = buyer.preferredCategories || [];
  const industryCats = INDUSTRY_SYNERGIES[buyer.category] || [];

  if (preferredCats.includes(listing.category)) {
    rawCategoryRatio = 1.0;
    reasons.push(`Direct preference match for ${listing.category}`);
  } else if (industryCats.includes(listing.category)) {
    rawCategoryRatio = 0.9;
    reasons.push(`High industry synergy for ${buyer.category} operations`);
  } else {
    rawCategoryRatio = 0.5;
  }
  const categoryScore = Math.round(rawCategoryRatio * 30 * 10) / 10;

  // 2. Geographical proximity (Weight: 20%)
  const buyerCity = buyer.city?.trim() || 'Kolkata';
  const listingCity = listing.locationCity?.trim() || 'Kolkata';
  const distanceKm = CITY_DISTANCES[buyerCity]?.[listingCity] ?? 
                     CITY_DISTANCES[listingCity]?.[buyerCity] ?? 150;

  let rawProximityRatio = 0.5;
  let transportationAdvice = 'Standard freight logistics recommended.';

  if (distanceKm <= 15) {
    rawProximityRatio = 1.0;
    transportationAdvice = 'Local delivery/pickup feasible; ultra-low carbon transit.';
    reasons.push(`Close proximity: within ${distanceKm === 0 ? 'same city' : distanceKm + ' km'}`);
  } else if (distanceKm <= 200) {
    rawProximityRatio = 0.8;
    transportationAdvice = 'Regional same-day highway logistics available via EcoLoop Logistics.';
    reasons.push(`Regional cluster: ${distanceKm} km transit distance`);
  } else if (distanceKm <= 600) {
    rawProximityRatio = 0.6;
    transportationAdvice = 'Inter-city freight logistics with consolidated cargo routes.';
  } else {
    rawProximityRatio = 0.35;
    transportationAdvice = 'Long-haul freight routing required; recommend bulk shipment for cost efficiency.';
  }
  const proximityScore = Math.round(rawProximityRatio * 20 * 10) / 10;

  // 3. Quantity compatibility (Weight: 15%)
  let rawQuantityRatio = 0.7;
  if (buyer.typicalQuantity && buyer.typicalQuantity > 0) {
    const ratio = Math.min(listing.quantity, buyer.typicalQuantity) / Math.max(listing.quantity, buyer.typicalQuantity);
    rawQuantityRatio = Math.max(0.4, Math.min(1.0, ratio + 0.3));
    if (listing.quantity >= buyer.typicalQuantity) {
      reasons.push(`Sufficient batch volume available (${listing.quantity} ${listing.unit})`);
    }
  } else {
    rawQuantityRatio = listing.quantity >= listing.minOrderQuantity ? 0.9 : 0.6;
  }
  const quantityScore = Math.round(rawQuantityRatio * 15 * 10) / 10;

  // 4. Price compatibility (Weight: 15%)
  let rawPriceRatio = 0.75;
  if (buyer.maxBudget && buyer.maxBudget > 0) {
    if (listing.pricePerUnit <= buyer.maxBudget) {
      rawPriceRatio = 1.0;
      reasons.push(`Price is within target budget (₹${listing.pricePerUnit}/${listing.unit})`);
    } else {
      const overRatio = listing.pricePerUnit / buyer.maxBudget;
      rawPriceRatio = Math.max(0.3, 1.0 - (overRatio - 1.0) * 0.8);
    }
  } else {
    rawPriceRatio = 0.85; // reasonable market price
  }
  const priceScore = Math.round(rawPriceRatio * 15 * 10) / 10;

  // 5. Material condition (Weight: 10%)
  const conditionRatios: Record<string, number> = {
    'Clean / High Grade': 1.0,
    'Surplus / Unused': 0.95,
    'Minor Defects': 0.8,
    'Recyclable / Unsorted': 0.75,
    'Scrap': 0.7,
  };
  const rawConditionRatio = conditionRatios[listing.condition] || 0.75;
  if (rawConditionRatio >= 0.9) {
    reasons.push(`Prime condition material: ${listing.condition}`);
  }
  const conditionScore = Math.round(rawConditionRatio * 10 * 10) / 10;

  // 6. Availability (Weight: 10%)
  const availabilityRatios: Record<string, number> = {
    'Immediate': 1.0,
    'Within 1 week': 0.85,
    'Recurring Monthly': 0.9,
    'Custom': 0.7,
  };
  const rawAvailabilityRatio = availabilityRatios[listing.availability] || 0.8;
  if (listing.availability === 'Immediate') {
    reasons.push('Immediate inventory readiness for dispatch');
  }
  const availabilityScore = Math.round(rawAvailabilityRatio * 10 * 10) / 10;

  const totalScore = Math.min(99, Math.max(45, Math.round(
    categoryScore + proximityScore + quantityScore + priceScore + conditionScore + availabilityScore
  )));

  return {
    matchPercentage: totalScore,
    factors: {
      categoryScore,
      proximityScore,
      quantityScore,
      priceScore,
      conditionScore,
      availabilityScore,
    },
    distanceKm,
    transportationAdvice,
    reasons,
  };
}
