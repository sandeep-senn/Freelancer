import express from 'express';
import { fetchChats } from '../controllers/chatController.js';
const router = express.Router();

router.get('/:id', fetchChats);

export default router;
