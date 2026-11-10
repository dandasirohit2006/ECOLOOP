import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const notificationsRouter = Router();

notificationsRouter.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user!.id, isRead: false },
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

notificationsRouter.put('/:id/read', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user!.id },
      data: { isRead: true },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification.' });
  }
});

notificationsRouter.put('/mark-all-read', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all as read.' });
  }
});
