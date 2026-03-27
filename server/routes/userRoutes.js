import express from 'express';
import { fetchUsers } from '../controllers/userController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', requireAuth, requireRole('admin'), fetchUsers);

export default router;
