import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const reportController = {
  // Asset Depreciation Report
  getAssetReport: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assets = await prisma.fixedAsset.findMany({
        include: {
          assetClass: true,
        },
        orderBy: { faNo: 'asc' }
      });

      const data = assets.map(a => ({
        assetNo: a.faNo,
        name: a.assetName,
        category: a.assetClass?.name,
        costCenter: 'N/A', // No relation available
        acquisitionValue: Number(a.acquisitionValue),
        accumulatedDeprn: Number(a.accumulatedDeprn),
        bookValue: Number(a.bookValue),
        status: a.assetStatus
      }));

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  // Work Order Cost Report
  getWorkOrderCostReport: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wos = await prisma.workOrder.findMany({
        where: { status: 'COMPLETED' },
        include: {
          equipment: true,
          costSummary: true,
        },
        orderBy: { completedDate: 'desc' }
      });

      const data = wos.map(wo => ({
        woNo: wo.woNo,
        equipment: wo.equipment?.name,
        type: wo.orderType,
        completedDate: wo.completedDate,
        laborCost: Number(wo.costSummary?.laborCost || 0),
        materialCost: Number(wo.costSummary?.materialCost || 0),
        serviceCost: Number(wo.costSummary?.serviceCost || 0),
        totalCost: Number(wo.costSummary?.totalCost || 0),
      }));

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  // Inventory Valuation Report
  getInventoryValuationReport: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const balances = await prisma.stockBalance.findMany({
        include: {
          item: true,
          location: true,
        },
        orderBy: { locationId: 'asc' }
      });

      const data = balances.map(b => {
        const qty = Number(b.qtyOnHand || 0);
        const cost = Number(b.item?.unitCost || 0);
        return {
          itemCode: b.item?.code,
          itemName: b.item?.name,
          category: b.item?.category,
          location: b.location?.name,
          qtyOnHand: qty,
          unitCost: cost,
          totalValue: qty * cost,
        };
      });

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
};
