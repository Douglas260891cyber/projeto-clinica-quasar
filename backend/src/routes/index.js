import express from 'express';
import authRoutes from './authRoutes.js';
import petRoutes from './petRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/pets', petRoutes);

export default router;
