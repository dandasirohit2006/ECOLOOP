import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const savedRouter = Router();

// GET all saved listings for user
savedRouter.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const saved = await prisma.savedListing.findMany({
      where: { userId: req.user!.id },
      include: {
        listing: {
          include: {
            images: true,
            seller: {
              select: { businessName: true, city: true, isVerified: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ savedListings: saved.map((s) => s.listing) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved listings.' });
  }
});

// POST save a listing
savedRouter.post('/:listingId', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { listingId } = req.params;
    const userId = req.user!.id;

    const existing = await prisma.savedListing.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });

    if (existing) {
      res.json({ message: 'Listing already saved.', isSaved: true });
      return;
    }

    await prisma.savedListing.create({
      data: { userId, listingId },
    });

    res.json({ message: 'Listing saved to favorites.', isSaved: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save listing.' });
  }
});

// DELETE remove saved listing
savedRouter.delete('/:listingId', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { listingId } = req.params;
    const userId = req.user!.id;

    await prisma.savedListing.deleteMany({
      where: { userId, listingId },
    });

    res.json({ message: 'Listing removed from favorites.', isSaved: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove saved listing.' });
  }
});
