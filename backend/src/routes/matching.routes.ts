import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth.js';
import { calculateMatchScore, BuyerProfileData } from '../services/matchingEngine.js';

export const matchingRouter = Router();

// GET AI recommended materials for the current user
matchingRouter.get('/recommendations', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const buyerPref = await prisma.buyerPreference.findUnique({
      where: { userId: user.id },
    });

    const buyerData: BuyerProfileData = {
      id: user.id,
      businessName: user.businessName,
      category: user.category,
      city: user.city,
      preferredCategories: buyerPref?.preferredCategories ? buyerPref.preferredCategories.split(',').filter(Boolean) : [],
      preferredCities: buyerPref?.preferredCities ? buyerPref.preferredCities.split(',').filter(Boolean) : [user.city],
      maxBudget: buyerPref?.maxBudget ?? null,
      typicalQuantity: buyerPref?.typicalQuantity ?? null,
    };

    // Find active materials not listed by the user
    const listings = await prisma.materialListing.findMany({
      where: {
        status: 'ACTIVE',
        sellerId: { not: user.id },
      },
      include: {
        images: true,
        seller: {
          select: {
            id: true,
            businessName: true,
            city: true,
            category: true,
            isVerified: true,
          },
        },
      },
    });

    const scored = listings.map((item) => {
      const match = calculateMatchScore(buyerData, item);
      return {
        ...item,
        aiMatch: match,
      };
    });

    // Sort by match percentage descending
    scored.sort((a, b) => b.aiMatch.matchPercentage - a.aiMatch.matchPercentage);

    res.json({
      recommendations: scored.slice(0, 8),
      totalMatches: scored.length,
      buyerContext: {
        category: user.category,
        city: user.city,
        preferredCategories: buyerData.preferredCategories,
      },
    });
  } catch (error) {
    console.error('Matching recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
});

// GET match score for a specific listing
matchingRouter.get('/material/:id', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await prisma.materialListing.findUnique({
      where: { id: req.params.id },
      include: {
        images: true,
        seller: {
          select: {
            id: true,
            businessName: true,
            city: true,
            category: true,
            isVerified: true,
          },
        },
      },
    });

    if (!listing) {
      res.status(404).json({ error: 'Material listing not found.' });
      return;
    }

    let buyerData: BuyerProfileData;
    if (req.user) {
      const buyerPref = await prisma.buyerPreference.findUnique({
        where: { userId: req.user.id },
      });
      buyerData = {
        id: req.user.id,
        businessName: req.user.businessName,
        category: req.user.category,
        city: req.user.city,
        preferredCategories: buyerPref?.preferredCategories ? buyerPref.preferredCategories.split(',').filter(Boolean) : [],
        preferredCities: buyerPref?.preferredCities ? buyerPref.preferredCities.split(',').filter(Boolean) : [req.user.city],
        maxBudget: buyerPref?.maxBudget ?? null,
        typicalQuantity: buyerPref?.typicalQuantity ?? null,
      };
    } else {
      buyerData = {
        id: 'guest',
        businessName: 'Guest Business',
        category: 'Manufacturing',
        city: listing.locationCity,
      };
    }

    const match = calculateMatchScore(buyerData, listing);
    res.json({ match });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate match score.' });
  }
});

// GET recommended buyers for a seller's listing
matchingRouter.get('/buyers-for-listing/:listingId', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await prisma.materialListing.findUnique({
      where: { id: req.params.listingId },
    });

    if (!listing) {
      res.status(404).json({ error: 'Listing not found.' });
      return;
    }

    // Find all other businesses except the seller
    const potentialBuyers = await prisma.user.findMany({
      where: { id: { not: req.user!.id } },
      include: { preferences: true },
    });

    const buyerMatches = potentialBuyers.map((buyer) => {
      const buyerData: BuyerProfileData = {
        id: buyer.id,
        businessName: buyer.businessName,
        category: buyer.category,
        city: buyer.city,
        preferredCategories: buyer.preferences?.preferredCategories ? buyer.preferences.preferredCategories.split(',').filter(Boolean) : [],
        preferredCities: buyer.preferences?.preferredCities ? buyer.preferences.preferredCities.split(',').filter(Boolean) : [buyer.city],
        maxBudget: buyer.preferences?.maxBudget ?? null,
        typicalQuantity: buyer.preferences?.typicalQuantity ?? null,
      };
      const match = calculateMatchScore(buyerData, listing);
      return {
        buyer: {
          id: buyer.id,
          businessName: buyer.businessName,
          category: buyer.category,
          city: buyer.city,
          isVerified: buyer.isVerified,
        },
        aiMatch: match,
      };
    });

    buyerMatches.sort((a, b) => b.aiMatch.matchPercentage - a.aiMatch.matchPercentage);

    res.json({ matchedBuyers: buyerMatches.slice(0, 5) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to match buyers for listing.' });
  }
});
