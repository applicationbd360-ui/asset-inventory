import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const analyticsController = {
  getCostsByWorkCenter: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wos = await prisma.workOrder.findMany({
        where: { costCenterId: { not: null } },
        include: {
          costCenter: true,
          costSummary: true
        }
      });
      
      const costMap = new Map<string, number>();
      wos.forEach(wo => {
        if (!wo.costCenter || !wo.costSummary) return;
        const ccName = wo.costCenter.name;
        const total = Number(wo.costSummary.totalCost) || 0;
        costMap.set(ccName, (costMap.get(ccName) || 0) + total);
      });

      const data = Array.from(costMap.entries()).map(([workCenter, cost]) => ({
        workCenter,
        cost
      }));

      // Sort by cost descending
      data.sort((a, b) => b.cost - a.cost);

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  getDamagesByCause: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const damages = await prisma.workOrder.groupBy({
        by: ['causeCode'],
        _count: {
          id: true
        },
        where: {
          causeCode: { not: null }
        }
      });

      const data = damages.map(d => ({
        causeCode: d.causeCode,
        count: d._count.id
      }));

      // Sort by count descending
      data.sort((a, b) => b.count - a.count);

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  getOrdersForPlanning: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plannedOrders = await prisma.workOrder.groupBy({
        by: ['priority'],
        _count: {
          id: true
        },
        where: {
          status: { in: ['CREATED', 'ASSIGNED'] }
        }
      });
      
      const summary = plannedOrders.map(p => ({
        priority: p.priority,
        count: p._count.id
      }));
      
      const unreleasedOrders = await prisma.workOrder.findMany({
        where: { status: { in: ['CREATED', 'ASSIGNED'] } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { equipment: { select: { name: true } } }
      });
      
      res.json({ 
        success: true, 
        data: {
          summary,
          list: unreleasedOrders.map(wo => ({
            id: wo.woNo,
            equipment: wo.equipment.name,
            priority: wo.priority,
            type: wo.orderType,
            date: wo.createdAt
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
