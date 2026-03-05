import express from 'express';
import {
  getAllTiers,
  getTierById,
  createTier,
  updateTier,
  deleteTier,
  getTierStats
} from '../controllers/tiersController.js';

const router = express.Router();

// Public routes
router.get('/', getAllTiers);
router.get('/stats', getTierStats);
router.get('/:id', getTierById);

// Admin routes (dibatasi di controller)
router.post('/', createTier);
router.put('/:id', updateTier);
router.delete('/:id', deleteTier);

export default router;
