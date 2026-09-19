import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── Map route prefixes to module names ────────────────────────
const routeModuleMap: Record<string, string> = {
  '/api/v1/maintenance': 'MAINTENANCE',
  '/api/v1/purchase': 'PURCHASE',
  '/api/v1/finance': 'FINANCE',
  '/api/v1/inventory': 'INVENTORY',
  '/api/v1/hfm': 'HFM',
  '/api/v1/system': 'SYSTEM',
  '/api/v1/auth': 'AUTH',
  '/api/v1/reports': 'REPORTS',
};

// ── Map route to human-readable entity type ───────────────────
const getEntityType = (path: string): string => {
  if (path.includes('work-orders')) return 'WorkOrder';
  if (path.includes('equipment')) return 'Equipment';
  if (path.includes('pm-plans')) return 'PMPlan';
  if (path.includes('purchase/pr')) return 'PurchaseRequest';
  if (path.includes('purchase/po')) return 'PurchaseOrder';
  if (path.includes('purchase/grn')) return 'GoodsReceipt';
  if (path.includes('purchase/rfq')) return 'RFQ';
  if (path.includes('finance/assets')) return 'FixedAsset';
  if (path.includes('finance/budgets')) return 'Budget';
  if (path.includes('finance/journals')) return 'Journal';
  if (path.includes('inventory')) return 'InventoryItem';
  if (path.includes('hfm')) return 'HFMRecord';
  return 'Record';
};

const getModule = (path: string): string => {
  for (const prefix of Object.keys(routeModuleMap)) {
    if (path.startsWith(prefix)) return routeModuleMap[prefix];
  }
  return 'SYSTEM';
};

const getAction = (method: string): string => {
  switch (method) {
    case 'POST':   return 'CREATE';
    case 'PUT':    return 'UPDATE';
    case 'PATCH':  return 'UPDATE';
    case 'DELETE': return 'DELETE';
    default:       return method;
  }
};

// ── Audit Middleware ──────────────────────────────────────────
export const auditLog = (req: Request, res: Response, next: NextFunction) => {
  // Only log mutating operations
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return next();
  }

  const originalJson = res.json.bind(res);

  res.json = function (body: any) {
    // Only log if the response was successful (2xx)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const user = (req as any).user;
      const ipAddress =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        'unknown';

      const entityType = getEntityType(req.path);
      const module     = getModule(req.path);
      const action     = getAction(req.method);

      // Extract the record ID from the response body or URL params
      const recordId = body?.data?.id ||
                       parseInt((req.params?.id as string) || '0') ||
                       0;

      // Fire-and-forget (don't block response)
      prisma.activityLog.create({
        data: {
          tableName: entityType.toLowerCase(),
          entityType,
          recordId,
          action,
          module,
          changedBy: user?.userId || null,
          userName:  user ? `${user.roleName} — ${user.email}` : 'System',
          ipAddress,
          newValues: body?.data ? (typeof body.data === 'object' ? body.data : { value: body.data }) : undefined,
        },
      }).catch((err) => console.error('❌ [AUDIT LOG ERROR]:', err.message));
    }

    return originalJson(body);
  };

  next();
};
