import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middleware/error.middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

// Dynamic Approval Matrix Logic
function determineNextApprover(pr: any, total: number, approvedRoles: string[]): string | null {
  const required = ['DEPARTMENT_HEAD'];

  if (pr.sourceModule === 'BIOMEDICAL') required.push('BIOMEDICAL_HEAD');
  if (pr.sourceDocType === 'WORK_ORDER') required.push('FACILITY_MANAGER');
  if (total >= 50000) required.push('FINANCE');
  if (total > 500000) required.push('MANAGEMENT');
  if (pr.isBudgetAvailable === false) required.push('CFO');
  
  if (total < 50000) required.push('PURCHASE'); // Purchase handles < 50k directly

  // Return the first required role that hasn't approved yet
  for (const role of required) {
    if (!approvedRoles.includes(role)) return role;
  }
  return null; // All approved
}

const prLineSchema = z.object({
  itemType: z.enum(['ASSET', 'INVENTORY_ITEM', 'SERVICE']),
  itemId: z.number().optional(),
  itemDescription: z.string().min(1),
  quantity: z.number().positive(),
  uomCode: z.string().optional(),
  estimatedUnitPrice: z.number().nonnegative(),
  assetClassCode: z.string().optional(),
  workOrderId: z.number().optional(),
  equipmentId: z.number().optional(),
});

const createPrSchema = z.object({
  sourceModule: z.string(),
  prType: z.enum(['ASSET', 'SPARE', 'SERVICE', 'AMC']),
  departmentId: z.number().optional(),
  costCenterId: z.number().optional(),
  requiredDate: z.string().optional(),
  justification: z.string().optional(),
  lines: z.array(prLineSchema).min(1, 'At least one line is required'),
});

const generatePrNo = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  const lastPr = await prisma.prHeader.findFirst({
    where: { prNo: { startsWith: `PR-${year}${month}-` } },
    orderBy: { id: 'desc' },
  });

  let seq = 1;
  if (lastPr) {
    const lastSeq = parseInt(lastPr.prNo.split('-')[2]);
    seq = lastSeq + 1;
  }
  return `PR-${year}${month}-${seq.toString().padStart(4, '0')}`;
};

export const prController = {
  createPr: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createPrSchema.parse(req.body);
      const prNo = await generatePrNo();
      
      let totalEstimated = 0;
      const lines = data.lines.map((l, index) => {
        totalEstimated += l.quantity * l.estimatedUnitPrice;
        return { ...l, lineNo: index + 1 };
      });

      const pr = await prisma.prHeader.create({
        data: {
          prNo,
          sourceModule: data.sourceModule,
          prType: data.prType,
          requestedById: (req as any).user.id,
          departmentId: data.departmentId,
          costCenterId: data.costCenterId,
          requiredDate: data.requiredDate ? new Date(data.requiredDate) : undefined,
          justification: data.justification,
          totalEstimated,
          approvalStatus: 'DRAFT',
          lines: {
            create: lines,
          },
        },
        include: { lines: true },
      });

      // Track Lifecycle Link for Integration Table
      const links = data.lines.map(line => {
        let sourceType = 'NEW_ASSET';
        if (data.prType === 'SPARE' && line.workOrderId) sourceType = 'SPARE_FOR_WO';
        else if (data.prType === 'SERVICE' && line.workOrderId) sourceType = 'SERVICE_FOR_WO';
        else if (data.prType === 'AMC') sourceType = 'AMC';
        
        return {
          prId: pr.id,
          prNo: pr.prNo,
          workOrderId: line.workOrderId || null,
          equipmentId: line.equipmentId || null,
          sourceType,
          linkStatus: 'ACTIVE'
        };
      });

      if (links.length > 0) {
        await prisma.assetProcurementLink.createMany({ data: links });
      }

      res.status(201).json({ success: true, data: pr });
    } catch (error) {
      next(error);
    }
  },

  getPrs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const prs = await prisma.prHeader.findMany({
        orderBy: { requestDate: 'desc' },
        include: {
          department: { select: { name: true } },
        },
      });
      res.json({ success: true, data: prs });
    } catch (error) {
      next(error);
    }
  },

  getPrById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const pr = await prisma.prHeader.findUnique({
        where: { id: Number(id) },
        include: {
          department: { select: { name: true } },
          lines: true,
        },
      });
      
      if (!pr) throw new AppError('PR not found', 404, 'NOT_FOUND');
      res.json({ success: true, data: pr });
    } catch (error) {
      next(error);
    }
  },

  submitForApproval: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const pr = await prisma.prHeader.findUnique({ 
        where: { id: Number(id) },
        include: { lines: true }
      });
      if (!pr) throw new AppError('PR not found', 404, 'NOT_FOUND');
      if (pr.approvalStatus !== 'DRAFT' && pr.approvalStatus !== 'REJECTED') {
        throw new AppError('Only DRAFT or REJECTED PRs can be submitted', 400);
      }

      // Calculate total
      const totalEstimated = pr.lines.reduce((sum, line) => sum + Number(line.quantity) * Number(line.estimatedUnitPrice), 0);
      
      // Determine next approver logic (stateless evaluation)
      const pendingWithRole = determineNextApprover(pr, totalEstimated, []);

      const updated = await prisma.prHeader.update({
        where: { id: Number(id) },
        data: { 
          approvalStatus: 'PENDING', 
          currentStep: 1,
          totalEstimated,
          pendingWithRole 
        },
      });

      res.json({ success: true, data: updated, message: 'PR submitted for approval to ' + pendingWithRole });
    } catch (error) {
      next(error);
    }
  },
  
  approvePr: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      
      const pr = await prisma.prHeader.findUnique({ 
        where: { id: Number(id) },
        include: { approvals: true } 
      });
      if (!pr) throw new AppError('PR not found', 404, 'NOT_FOUND');
      if (pr.approvalStatus !== 'PENDING') throw new AppError('PR is not pending approval', 400);

      // Verify the user has the required role (Mocking role check based on pendingWithRole)
      // In a real app, user.role.name should match pr.pendingWithRole
      
      // Log the approval
      await prisma.prApprovalLog.create({
        data: {
          prId: pr.id,
          approverId: user.id || 1,
          approverRole: pr.pendingWithRole || 'UNKNOWN',
          status: 'APPROVED',
          comments: 'Approved via System'
        }
      });

      // Fetch updated approvals
      const updatedApprovals = await prisma.prApprovalLog.findMany({ where: { prId: pr.id, status: 'APPROVED' } });
      const approvedRoles = updatedApprovals.map(a => a.approverRole);

      // Determine next approver
      const nextApprover = determineNextApprover(pr, Number(pr.totalEstimated), approvedRoles);

      let finalStatus = 'PENDING';
      let message = `PR approved by ${pr.pendingWithRole}, forwarded to ${nextApprover}`;

      if (!nextApprover) {
        finalStatus = 'APPROVED';
        message = 'PR Fully Approved!';
      }

      const updated = await prisma.prHeader.update({
        where: { id: Number(id) },
        data: { 
          approvalStatus: finalStatus,
          pendingWithRole: nextApprover,
          currentStep: pr.currentStep + 1
        },
      });

      res.json({ success: true, data: updated, message });
    } catch (error) {
      next(error);
    }
  }
};
