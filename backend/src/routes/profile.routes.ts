import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const profileRouter = Router();

profileRouter.get('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        preferences: true,
        _count: {
          select: {
            listings: true,
            buyerOrders: true,
            sellerOrders: true,
            sellerRequests: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { password, ...safeUser } = user;
    res.json({ profile: safeUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

profileRouter.put('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      businessName,
      contactPerson,
      phone,
      city,
      address,
      category,
      bio,
      preferredCategories,
      preferredCities,
      maxBudget,
      typicalQuantity,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        businessName: businessName?.trim(),
        contactPerson: contactPerson ? contactPerson.trim() : null,
        phone: phone?.trim(),
        city: city?.trim(),
        address: address ? address.trim() : null,
        category: category?.trim(),
        bio: bio ? bio.trim() : null,
      },
    });

    // Upsert preferences
    const preferences = await prisma.buyerPreference.upsert({
      where: { userId: req.user!.id },
      create: {
        userId: req.user!.id,
        preferredCategories: Array.isArray(preferredCategories) ? preferredCategories.join(',') : (preferredCategories || ''),
        preferredCities: Array.isArray(preferredCities) ? preferredCities.join(',') : (preferredCities || updatedUser.city),
        maxBudget: maxBudget ? parseFloat(maxBudget) : null,
        typicalQuantity: typicalQuantity ? parseFloat(typicalQuantity) : null,
      },
      update: {
        preferredCategories: Array.isArray(preferredCategories) ? preferredCategories.join(',') : (preferredCategories || ''),
        preferredCities: Array.isArray(preferredCities) ? preferredCities.join(',') : (preferredCities || updatedUser.city),
        maxBudget: maxBudget !== undefined ? (maxBudget ? parseFloat(maxBudget) : null) : undefined,
        typicalQuantity: typicalQuantity !== undefined ? (typicalQuantity ? parseFloat(typicalQuantity) : null) : undefined,
      },
    });

    const { password, ...safeUser } = updatedUser;
    res.json({
      message: 'Profile updated successfully',
      profile: { ...safeUser, preferences },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

profileRouter.get('/public/:id', async (req, res): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        businessName: true,
        category: true,
        city: true,
        address: true,
        bio: true,
        isVerified: true,
        createdAt: true,
        listings: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            title: true,
            category: true,
            pricePerUnit: true,
            unit: true,
            quantity: true,
            condition: true,
            images: { take: 1 },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Business profile not found' });
      return;
    }

    res.json({ profile: user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public profile' });
  }
});
