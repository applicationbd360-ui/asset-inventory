import { Router } from 'express';
import { vendorController } from './vendor.controller';
import { prController } from './pr.controller';
import { poController } from './po.controller';
import { grnController } from './grn.controller';
import { rfqController } from './rfq.controller';
import { rmaController } from './rma.controller';
import { authorize } from '../../middleware/auth.middleware';

const router = Router();

// ── RFQ ──────────────────────────────────────────────────────
router.post('/rfqs', authorize(['PURCHASE:CREATE', 'ADMIN']), rfqController.createRfq);
router.get('/rfqs', authorize(['PURCHASE:READ', 'ADMIN']), rfqController.getAllRfqs);
router.get('/rfqs/:id', authorize(['PURCHASE:READ', 'ADMIN']), rfqController.getRfqById);
router.post('/rfqs/:id/quotations', authorize(['PURCHASE:CREATE', 'ADMIN']), rfqController.addQuotation);
router.post('/rfqs/:id/select-vendor', authorize(['PURCHASE:UPDATE', 'ADMIN']), rfqController.selectVendor);

// ── Vendors ──────────────────────────────────────────────────
router.post('/vendors', authorize(['PURCHASE:CREATE', 'ADMIN']), vendorController.createVendor);
router.get('/vendors', authorize(['PURCHASE:READ', 'ADMIN', 'EAM:READ']), vendorController.getVendors);
router.get('/vendors/:id', authorize(['PURCHASE:READ', 'ADMIN', 'EAM:READ']), vendorController.getVendorById);
router.put('/vendors/:id', authorize(['PURCHASE:UPDATE', 'ADMIN']), vendorController.updateVendor);

// ── Purchase Requisitions (PR) ────────────────────────────────
router.post('/pr', authorize(['PURCHASE:CREATE', 'ADMIN']), prController.createPr);
router.get('/pr', authorize(['PURCHASE:READ', 'ADMIN']), prController.getPrs);
router.get('/pr/:id', authorize(['PURCHASE:READ', 'ADMIN']), prController.getPrById);
router.post('/pr/:id/submit', authorize(['PURCHASE:UPDATE', 'ADMIN']), prController.submitForApproval);
router.post('/pr/:id/approve', authorize(['PURCHASE:APPROVE', 'ADMIN']), prController.approvePr);

// ── Purchase Orders (PO) ──────────────────────────────────────
router.post('/po', authorize(['PURCHASE:CREATE', 'ADMIN']), poController.createPo);
router.get('/po', authorize(['PURCHASE:READ', 'ADMIN']), poController.getPos);
router.get('/po/:id', authorize(['PURCHASE:READ', 'ADMIN']), poController.getPoById);
router.post('/po/:id/approve', authorize(['PURCHASE:APPROVE', 'ADMIN']), poController.approvePo);

// ── GRN ──────────────────────────────────────────────────────
router.post('/grn', authorize(['PURCHASE:CREATE', 'ADMIN', 'STORE:WRITE']), grnController.createGrn);
router.get('/grn', authorize(['PURCHASE:READ', 'ADMIN', 'STORE:READ']), grnController.getGrns);
router.get('/grn/:id', authorize(['PURCHASE:READ', 'ADMIN', 'STORE:READ']), grnController.getGrnById);
router.put('/grn/lines/:lineId/inspect', authorize(['PURCHASE:UPDATE', 'ADMIN', 'STORE:WRITE']), grnController.inspectGrnLine);

// ── RMA / Returns ────────────────────────────────────────────
router.post('/rma', authorize(['PURCHASE:CREATE', 'ADMIN']), rmaController.createRma);
router.get('/rma', authorize(['PURCHASE:READ', 'ADMIN']), rmaController.getRmas);
router.patch('/rma/:id/status', authorize(['PURCHASE:UPDATE', 'ADMIN']), rmaController.updateRmaStatus);

export default router;
