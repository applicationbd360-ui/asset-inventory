import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const systemController = {
  getNotifications: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.userId || 1;

      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      const unreadCount = await prisma.notification.count({
        where: { userId, isRead: false }
      });

      res.json({ success: true, data: notifications, unreadCount });
    } catch (error) {
      next(error);
    }
  },

  markNotificationRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const notification = await prisma.notification.update({
        where: { id: parseInt(id as string) },
        data: { isRead: true }
      });

      res.json({ success: true, data: notification });
    } catch (error) {
      next(error);
    }
  },

  markAllNotificationsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.userId || 1;
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  },

  getAuditLogs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { module, action, startDate, endDate, page = '1', limit = '50' } = req.query;

      const where: any = {};
      if (module) where.module = String(module);
      if (action) where.action = String(action);
      if (startDate || endDate) {
        where.changedAt = {};
        if (startDate) where.changedAt.gte = new Date(String(startDate));
        if (endDate)   where.changedAt.lte = new Date(String(endDate) + 'T23:59:59Z');
      }

      const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));
      const take = parseInt(String(limit));

      const [logs, total] = await Promise.all([
        prisma.activityLog.findMany({
          where,
          orderBy: { changedAt: 'desc' },
          skip,
          take,
        }),
        prisma.activityLog.count({ where }),
      ]);

      res.json({
        success: true,
        data: logs,
        pagination: {
          total,
          page: parseInt(String(page)),
          limit: take,
          pages: Math.ceil(total / take)
        },
      });
    } catch (error) {
      next(error);
    }
  }
};
