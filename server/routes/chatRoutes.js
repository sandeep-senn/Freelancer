import express from 'express';
import { fetchChats, sendMessage } from '../controllers/chatController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/project/:projectId', requireAuth, fetchChats);
router.post('/project/:projectId/message', requireAuth, sendMessage);

export default router;
