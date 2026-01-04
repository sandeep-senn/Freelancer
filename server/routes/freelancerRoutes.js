import express from 'express';
import { fetchFreelancer, updateFreelancer } from '../controllers/freelancerController.js';
const router = express.Router();

router.post('/update', updateFreelancer);
router.get('/:id', fetchFreelancer);

export default router;
