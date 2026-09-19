import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middleware/error.middleware';

const prisma = new PrismaClient();

export const budgetController = {
  getBudgets: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { year } = req.query;
      const fiscalYear = year ? parseInt(year as string) : new Date().getFullYear();

      const budgets = await prisma.budget.findMany({
        where: { fiscalYear },
        include: { costCenter: true },
        orderBy: { costCenterId: 'asc' },
      });

      const formatted = budgets.map((b) => ({
        ...b,
        availableAmount: Number(b.budgetedAmount) - Number(b.utilizedAmount) - Number(b.committedAmount),
      }));

      res.json({ success: true, data: formatted });
    } catch (error) {
      next(error);
    }
  },

  allocateBudget: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fiscalYear, budgetType, costCenterId, budgetedAmount } = req.body;

      if (!fiscalYear || !budgetType || !costCenterId || !budgetedAmount) {
        throw new AppError('Missing required fields', 400);
      }

      const budget = await prisma.budget.upsert({
        where: {
          fiscalYear_budgetType_costCenterId_glCode: {
            fiscalYear,
            budgetType,
            costCenterId,
            glCode: null as unknown as string, // Handled implicitly if null
          }
        },
        update: {
          budgetedAmount,
        },
        create: {
          fiscalYear,
          budgetType,
          costCenterId,
          budgetedAmount,
        },
      });

      res.status(201).json({ success: true, data: budget });
    } catch (error) {
      // Temporary workaround for unique constraint with nullable glCode in upsert
      try {
        const { fiscalYear, budgetType, costCenterId, budgetedAmount } = req.body;
        let budget = await prisma.budget.findFirst({
          where: { fiscalYear, budgetType, costCenterId }
        });
        
        if (budget) {
          budget = await prisma.budget.update({
            where: { id: budget.id },
            data: { budgetedAmount }
          });
        } else {
          budget = await prisma.budget.create({
            data: { fiscalYear, budgetType, costCenterId, budgetedAmount }
          });
        }
        res.status(201).json({ success: true, data: budget });
      } catch (innerError) {
        next(innerError);
      }
    }
  },

  checkBudgetAvailability: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { costCenterId, budgetType, requiredAmount } = req.body;
      const fiscalYear = new Date().getFullYear();

      const budget = await prisma.budget.findFirst({
        where: { costCenterId, budgetType, fiscalYear }
      });

      if (!budget) {
        return res.json({ success: true, isAvailable: false, message: 'No budget allocated for this cost center' });
      }

      const available = Number(budget.budgetedAmount) - Number(budget.utilizedAmount) - Number(budget.committedAmount);
      
      res.json({ 
        success: true, 
        isAvailable: available >= requiredAmount,
        availableAmount: available 
      });
    } catch (error) {
      next(error);
    }
  },

  getMroFinancialForecast: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const locations = ['OPERATIONSITE1', 'OPERATIONSITE2', 'GLOBAL_DISTRIBUTION_CENTER'];
      
      const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() + i);
        return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }).replace(' ', '-'); // e.g. Nov-24
      });

      const tableData: any[] = [];
      const chartData: any[] = [];

      locations.forEach(loc => {
        const baseCost = loc === 'GLOBAL_DISTRIBUTION_CENTER' ? 150000 : 80000;
        
        const row = {
          locationId: loc,
          keyFigures: {
            correctiveMaint: months.map(() => Math.floor(Math.random() * 40000) + baseCost),
            preventiveMaint: months.map(() => Math.floor(Math.random() * 20000) + (baseCost * 0.4)),
            unforeseenOverwritten: months.map(() => (Math.random() > 0.8 ? Math.floor(Math.random() * 15000) : 0)),
          } as any
        };

        // Calculate total
        row.keyFigures['totalCost'] = row.keyFigures.correctiveMaint.map(
          (cm: number, i: number) => cm + row.keyFigures.preventiveMaint[i] + row.keyFigures.unforeseenOverwritten[i]
        );

        tableData.push(row);
      });

      // Format for the chart: Aggregate total forecast per month per location
      months.forEach((month, mIndex) => {
        const monthChartItem: any = { name: month };
        locations.forEach(loc => {
          let sum = 0;
          tableData.forEach(row => {
            if (row.locationId === loc) {
              sum += row.keyFigures.totalCost[mIndex];
            }
          });
          monthChartItem[loc] = sum;
        });
        chartData.push(monthChartItem);
      });

      res.json({ 
        success: true, 
        data: {
          months,
          table: tableData,
          chart: chartData
        } 
      });
    } catch (error) {
      next(error);
    }
  }
};
