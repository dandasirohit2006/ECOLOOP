export interface ImpactMetrics {
  co2SavedKg: number;
  landfillDivertedKg: number;
  waterSavedLiters: number;
  treesEquivalent: number;
}

// Environmental factors per kg of material diverted from waste
const IMPACT_FACTORS: Record<string, { co2: number; landfill: number; water: number; trees: number }> = {
  'Paper/Cardboard': { co2: 0.94, landfill: 1.0, water: 26.0, trees: 0.017 },
  'Plastic': { co2: 1.85, landfill: 1.0, water: 22.0, trees: 0.005 },
  'Metal': { co2: 3.50, landfill: 1.0, water: 15.0, trees: 0.008 },
  'Textile': { co2: 3.80, landfill: 1.0, water: 35.0, trees: 0.010 },
  'Glass': { co2: 0.38, landfill: 1.0, water: 5.0, trees: 0.002 },
  'Wood': { co2: 0.85, landfill: 1.0, water: 8.0, trees: 0.035 },
  'Food waste': { co2: 1.25, landfill: 1.0, water: 12.0, trees: 0.004 },
  'Construction materials': { co2: 0.65, landfill: 1.0, water: 6.0, trees: 0.003 },
  'Industrial scrap': { co2: 2.20, landfill: 1.0, water: 18.0, trees: 0.007 },
  'Packaging materials': { co2: 1.10, landfill: 1.0, water: 20.0, trees: 0.012 },
  'Furniture': { co2: 1.40, landfill: 1.0, water: 10.0, trees: 0.020 },
  'Business equipment': { co2: 4.50, landfill: 1.0, water: 30.0, trees: 0.015 },
};

export function calculateEnvironmentalImpact(category: string, quantityKg: number): ImpactMetrics {
  const factors = IMPACT_FACTORS[category] || { co2: 1.0, landfill: 1.0, water: 10.0, trees: 0.005 };

  const co2SavedKg = Math.round(quantityKg * factors.co2 * 10) / 10;
  const landfillDivertedKg = Math.round(quantityKg * factors.landfill * 10) / 10;
  const waterSavedLiters = Math.round(quantityKg * factors.water);
  const treesEquivalent = Math.round(quantityKg * factors.trees * 100) / 100;

  return {
    co2SavedKg,
    landfillDivertedKg,
    waterSavedLiters,
    treesEquivalent,
  };
}
