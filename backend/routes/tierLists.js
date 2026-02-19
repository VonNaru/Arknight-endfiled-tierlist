import express from 'express';
import {
  getAllTierLists,
  getTierListById,
  createTierList,
  updateTierList,
  deleteTierList
} from '../controllers/tierListController.js';

const router = express.Router();

router.get('/', getAllTierLists);
router.get('/:id', getTierListById);
router.post('/', createTierList);
router.put('/:id', updateTierList);
router.delete('/:id', deleteTierList);

export default router;
