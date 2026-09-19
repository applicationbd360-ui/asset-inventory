import { Router } from 'express';
import { reportController } from './report.controller';
import { authorize } from '../../middleware/auth.middleware';

const router = Router();

router.get('/asset-depreciation', authorize(['ADMIN', 'FINANCE:READ']), reportController.getAssetReport);
router.get('/work-order-costs', authorize(['ADMIN', 'MAINTENANCE:READ']), reportController.getWorkOrderCostReport);
router.get('/inventory-valuation', authorize(['ADMIN', 'INVENTORY:READ']), reportController.getInventoryValuationReport);

export default router;
