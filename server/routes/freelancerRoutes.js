import express from 'express';
import { fetchFreelancer, updateFreelancer } from '../controllers/freelancerController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/update', requireAuth, requireRole('freelancer'), updateFreelancer);
router.get('/me', requireAuth, requireRole('freelancer'), fetchFreelancer);
router.get('/:id', requireAuth, fetchFreelancer);

export default router;
