import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const journalController = {
  getJournals: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const journals = await prisma.journalHeader.findMany({
        orderBy: { postingDate: 'desc' },
      });
      res.json({ success: true, data: journals });
    } catch (error) {
      next(error);
    }
  },

  createJournal: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { description, amount } = req.body;
      const count = await prisma.journalHeader.count();
      const journalNo = `JV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
      
      const newJournal = await prisma.journalHeader.create({
        data: {
          journalNo,
          postingDate: new Date(),
          sourceModule: 'MANUAL',
          sourceDocType: 'MANUAL',
          sourceDocId: 0,
          narration: description || 'Manual Journal Entry',
          totalDebit: Number(amount) || 0,
          totalCredit: Number(amount) || 0,
          postingStatus: 'POSTED',
          createdById: (req as any).user?.userId || 1
        }
      });
      res.status(201).json({ success: true, data: newJournal });
    } catch (error) {
      next(error);
    }
  },

  getJournalById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const journal = await prisma.journalHeader.findUnique({
        where: { id: Number(id) },
        include: {
          lines: {
            include: { glAccount: true }
          }
        },
      });
      res.json({ success: true, data: journal });
    } catch (error) {
      next(error);
    }
  },

  getChartOfAccounts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accounts = await prisma.chartOfAccounts.findMany({
        orderBy: { glCode: 'asc' },
      });
      res.json({ success: true, data: accounts });
    } catch (error) {
      next(error);
    }
  },

  getAssetClasses: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const classes = await prisma.assetClass.findMany();
      res.json({ success: true, data: classes });
    } catch (error) {
      next(error);
    }
  }
};
