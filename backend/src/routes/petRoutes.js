import express from 'express';
import { getPets, createPetController } from '../controllers/petController.js';

const router = express.Router();

router.get('/', getPets);
router.post('/', createPetController);

export default router;
