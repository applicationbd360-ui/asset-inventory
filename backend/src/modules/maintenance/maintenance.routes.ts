import { Router } from 'express';
import { workorderController } from './workorder.controller';
import { equipmentController } from './equipment.controller';
import { pmController } from './pm.controller';
import { componentsController } from './components.controller';
import { authorize } from '../../middleware/auth.middleware';

const router = Router();

// ── Equipment Master ──────────────────────────────────────────
router.get('/equipment', authorize(['MAINTENANCE:READ', 'ADMIN']), equipmentController.getEquipments);
router.get('/equipment/:id', authorize(['MAINTENANCE:READ', 'ADMIN']), equipmentController.getEquipmentById);
router.patch('/equipment/:id', authorize(['MAINTENANCE:UPDATE', 'ADMIN']), equipmentController.updateEquipment);
router.get('/equipment/:id/qr', authorize(['MAINTENANCE:READ', 'ADMIN']), equipmentController.generateEquipmentQr);

// ── Equipment Components / Asset BOM ────────────────────────
router.get('/equipment/:id/components', authorize(['MAINTENANCE:READ', 'ADMIN']), componentsController.getEquipmentComponents);
router.post('/equipment/:id/components', authorize(['MAINTENANCE:UPDATE', 'ADMIN']), componentsController.addComponent);
router.patch('/equipment/components/:id/remove', authorize(['MAINTENANCE:UPDATE', 'ADMIN']), componentsController.removeComponent);

// ── Work Orders ───────────────────────────────────────────────
router.get('/work-orders', authorize(['MAINTENANCE:READ', 'ADMIN']), workorderController.getWorkOrders);
router.get('/work-orders/:id', authorize(['MAINTENANCE:READ', 'ADMIN']), workorderController.getWorkOrderById);
router.post('/work-orders', authorize(['MAINTENANCE:CREATE', 'ADMIN']), workorderController.createWorkOrder);
router.post('/work-orders/commissioning', authorize(['MAINTENANCE:CREATE', 'ADMIN']), workorderController.createCommissioningWo);
router.put('/work-orders/:id/status', authorize(['MAINTENANCE:UPDATE', 'ADMIN']), workorderController.updateWorkOrderStatus);
router.post('/work-orders/:id/labor', authorize(['MAINTENANCE:UPDATE', 'ADMIN']), workorderController.addLabor);
router.post('/work-orders/:id/materials', authorize(['MAINTENANCE:UPDATE', 'ADMIN']), workorderController.addMaterial);
router.post('/work-orders/:id/services', authorize(['MAINTENANCE:UPDATE', 'ADMIN']), workorderController.addService);
router.post('/work-orders/:id/close', authorize(['MAINTENANCE:UPDATE', 'ADMIN']), workorderController.closeWorkOrder);
router.patch('/work-orders/:id/checklist', authorize(['MAINTENANCE:UPDATE', 'ADMIN']), workorderController.updateWoChecklist);

// ── PM Plans ──────────────────────────────────────────────────
router.get('/pm-plans', authorize(['MAINTENANCE:READ', 'ADMIN']), pmController.getPmPlans);
router.get('/pm-plans/:id', authorize(['MAINTENANCE:READ', 'ADMIN']), pmController.getPmPlanById);
router.post('/pm-plans', authorize(['MAINTENANCE:UPDATE', 'ADMIN']), pmController.createPmPlan);
router.patch('/pm-plans/:id', authorize(['MAINTENANCE:UPDATE', 'ADMIN']), pmController.updatePmPlan);
router.delete('/pm-plans/:id', authorize(['MAINTENANCE:UPDATE', 'ADMIN']), pmController.deletePmPlan);

export default router;
