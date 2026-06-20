import express from 'express';
import { deleteUser, fetchUsers, updateUserRole } from '../controllers/userController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', requireAuth, requireRole('admin'), fetchUsers);
router.put('/:id/role', requireAuth, requireRole('admin'), updateUserRole);
router.delete('/:id', requireAuth, requireRole('admin'), deleteUser);

export default router;
