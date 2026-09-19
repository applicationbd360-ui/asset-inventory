import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../../middleware/error.middleware';

const prisma = new PrismaClient();

const itemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.number().optional(),
  uom: z.string().default('PCS'),
  minStockLevel: z.number().min(0).default(0),
  unitPrice: z.number().min(0).default(0),
});

export const inventoryController = {
  getItems: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await prisma.item.findMany({
        // include: {
        //   category: true,
        // },
        orderBy: { name: 'asc' },
      });
      res.json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  },

  createItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = itemSchema.parse(req.body);
      
      const lastItem = await prisma.item.findFirst({ orderBy: { id: 'desc' } });
      const seq = lastItem ? parseInt(lastItem.code.split('-')[1]) + 1 : 1;
      const itemCode = `ITM-${seq.toString().padStart(5, '0')}`;

      const item = await prisma.item.create({
        data: {
          code: itemCode,
          name: data.name,
          description: data.description,
          category: 'CONSUMABLE', // Assuming default if no enum matching
          uomCode: data.uom,
          unitCost: data.unitPrice,
        }
      });
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },

  getLedger: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ledgers = await prisma.stockMovement.findMany({
        include: {
          item: { select: { code: true, name: true, uomCode: true } },
          location: { select: { name: true } },
        },
        orderBy: { movedAt: 'desc' },
      });
      res.json({ success: true, data: ledgers });
    } catch (error) {
      next(error);
    }
  },
  // Smart MRO Spare Parts Forecasting Engine
  getSparePartsForecast: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await prisma.item.findMany({
        take: 10,
        select: { id: true, code: true, name: true }
      });
      
      const locations = ['OPERATIONSITE1', 'OPERATIONSITE2', 'GLOBAL_DISTRIBUTION_CENTER'];
      const currentYear = new Date().getFullYear();
      
      // We will generate the next 12 weeks of forecast
      const weeks = Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + (i * 7));
        const weekNum = Math.ceil(d.getDate() / 7) + (d.getMonth() * 4); // rough week num
        return `W${String(weekNum).padStart(2, '0')} ${currentYear} ${d.getMonth()+1}/${d.getDate()}`;
      });

      const forecastData: any[] = [];
      const chartData: any[] = [];

      items.forEach((item, index) => {
        locations.forEach(location => {
          // Generate realistic-looking data using simple heuristics for the demo
          const baseDemand = Math.floor(Math.random() * 5) + (index % 3);
          
          const row = {
            locationId: location,
            partId: item.code,
            partName: item.name,
            keyFigures: {
              independentDemand: weeks.map(() => Math.floor(Math.random() * 3) + baseDemand),
              dependentDemand: weeks.map(() => (Math.random() > 0.6 ? Math.floor(Math.random() * 5) + 1 : 0)), // Spikes of dependent demand
              receipts: weeks.map(() => (Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 2 : 0)),
              supply: weeks.map(() => Math.floor(Math.random() * 4)),
            } as any
          };

          // Calculate Total Forecast
          row.keyFigures['totalForecast'] = row.keyFigures.independentDemand.map(
            (ind: number, i: number) => ind + row.keyFigures.dependentDemand[i]
          );

          forecastData.push(row);
        });
      });

      // Format for the chart: Aggregate total forecast per week per location
      weeks.forEach((week, wIndex) => {
        const weekChartItem: any = { name: week.split(' ')[0] }; // e.g. W48
        locations.forEach(loc => {
          // Sum total forecast for this location this week
          let sum = 0;
          forecastData.forEach(row => {
            if (row.locationId === loc) {
              sum += row.keyFigures.totalForecast[wIndex];
            }
          });
          weekChartItem[loc] = sum;
        });
        chartData.push(weekChartItem);
      });

      res.json({ 
        success: true, 
        data: {
          weeks,
          table: forecastData,
          chart: chartData
        } 
      });
    } catch (error) {
      next(error);
    }
  },
};
