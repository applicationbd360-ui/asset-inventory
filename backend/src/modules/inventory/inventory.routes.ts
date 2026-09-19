import { Router } from 'express';
import { inventoryController } from './inventory.controller';
import { authorize } from '../../middleware/auth.middleware';

const router = Router();

// ── Inventory Items ───────────────────────────────────────────
router.get('/items', authorize(['INVENTORY:READ', 'ADMIN']), inventoryController.getItems);
router.post('/items', authorize(['INVENTORY:CREATE', 'ADMIN']), inventoryController.createItem);

// ── Stock Ledger ──────────────────────────────────────────────
router.get('/ledger', authorize(['INVENTORY:READ', 'ADMIN']), inventoryController.getLedger);

// ── Forecasting ───────────────────────────────────────────────
router.get('/forecasting', authorize(['INVENTORY:READ', 'ADMIN']), inventoryController.getSparePartsForecast);

export default router;
