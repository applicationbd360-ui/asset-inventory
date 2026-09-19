import { Router } from 'express';
import { systemController } from './system.controller';
import { userController } from './user.controller';
import { roleController } from './role.controller';
import { authorize } from '../../middleware/auth.middleware';

const router = Router();

router.get('/notifications', systemController.getNotifications);
router.put('/notifications/:id/read', systemController.markNotificationRead);
router.put('/notifications/mark-all-read', systemController.markAllNotificationsRead);

router.get('/audit-logs', authorize(['ADMIN']), systemController.getAuditLogs);

// ── Users ────────────────────────────────────────────────────
router.get('/users', authorize(['ADMIN']), userController.getUsers);
router.post('/users', authorize(['ADMIN']), userController.createUser);
router.put('/users/:id', authorize(['ADMIN']), userController.updateUser);
router.put('/users/:id/reset-password', authorize(['ADMIN']), userController.resetPassword);
router.delete('/users/:id', authorize(['ADMIN']), userController.deleteUser);

// ── Roles ────────────────────────────────────────────────────
router.get('/roles', authorize(['ADMIN']), roleController.getRoles);
router.post('/roles', authorize(['ADMIN']), roleController.createRole);
router.put('/roles/:id', authorize(['ADMIN']), roleController.updateRole);
router.delete('/roles/:id', authorize(['ADMIN']), roleController.deleteRole);

export default router;
