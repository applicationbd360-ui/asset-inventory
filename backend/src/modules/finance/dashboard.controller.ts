import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dashboardController = {
  getSummary: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // KPI 1: Total Assets
      const totalAssets = await prisma.fixedAsset.count({
        where: { assetStatus: { in: ['CAPITALIZED', 'INSTALLED', 'ACTIVE'] } }
      });

      // KPI 2: Open Work Orders
      const openWOs = await prisma.workOrder.count({
        where: { status: { in: ['CREATED', 'ASSIGNED', 'IN_PROGRESS'] } }
      });

      // KPI 3: Critical Equipment
      const criticalEq = await prisma.equipment.count({
        where: { criticality: 'CRITICAL', isActive: true }
      });

      // Recent Work Orders
      const recentWorkOrders = await prisma.workOrder.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { equipment: { select: { name: true, code: true } } }
      });

      // Asset Status Breakdown
      const statusGroups = await prisma.equipment.groupBy({
        by: ['status'],
        _count: true
      });

      // Mapped to chart format
      const assetStatusData = statusGroups.map((g) => ({
        name: g.status,
        value: g._count,
        color: g.status === 'ACTIVE' ? 'hsl(152, 69%, 40%)' :
               g.status === 'BREAKDOWN' ? 'hsl(0, 80%, 58%)' :
               g.status === 'UNDER_MAINTENANCE' ? 'hsl(38, 95%, 54%)' : 'hsl(214, 15%, 55%)'
      }));

      // In case we don't have enough data yet, pad with some defaults for visual
      if (assetStatusData.length === 0) {
         assetStatusData.push(
           { name: 'Active', value: 0, color: 'hsl(152, 69%, 40%)' },
           { name: 'Maintenance', value: 0, color: 'hsl(38, 95%, 54%)' }
         );
      }

      const formattedWOs = recentWorkOrders.map(wo => ({
        id: wo.woNo,
        equipment: `${wo.equipment?.name} (${wo.equipment?.code})`,
        type: wo.orderType,
        status: wo.status,
        priority: wo.priority,
        due: wo.dueDate ? wo.dueDate.toISOString().split('T')[0] : 'N/A'
      }));

      const pendingPrs = await prisma.prHeader.count({
        where: { approvalStatus: 'PENDING' }
      });
      const pendingPos = await prisma.poHeader.count({
        where: { approvalStatus: 'PENDING' }
      });

      res.json({
        success: true,
        data: {
          kpis: {
            totalAssets,
            openWOs,
            criticalEq,
            pendingPrs,
            pendingPos,
            pmCompliance: '98.5%' // Mocked calculation for now
          },
          assetStatusData,
          recentWorkOrders: formattedWOs
        }
      });
    } catch (error) {
      next(error);
    }
  },

  getAnalytics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Monthly Downtime Trend
      const downtimeData = [
        { name: 'Jan', downtime: 120, target: 100 },
        { name: 'Feb', downtime: 80, target: 100 },
        { name: 'Mar', downtime: 150, target: 100 },
        { name: 'Apr', downtime: 90, target: 100 },
        { name: 'May', downtime: 40, target: 100 },
        { name: 'Jun', downtime: Math.floor(Math.random() * 100) + 50, target: 100 },
      ];

      // Work Order Trends
      const workOrderTrend = [
        { month: 'Jan', workOrders: 12, completed: 10 },
        { month: 'Feb', workOrders: 18, completed: 15 },
        { month: 'Mar', workOrders: 14, completed: 13 },
        { month: 'Apr', workOrders: 22, completed: 18 },
        { month: 'May', workOrders: 16, completed: 14 },
        { month: 'Jun', workOrders: Math.floor(Math.random() * 30) + 10, completed: 20 },
      ];

      res.json({
        success: true,
        data: {
          downtimeData,
          workOrderTrend
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
