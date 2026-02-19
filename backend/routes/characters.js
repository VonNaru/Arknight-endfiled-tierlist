import express from 'express';
import {
  getAllCharacters,
  getCharacterById,
  addCharacter,
  updateCharacter,
  deleteCharacter,
  getCharacterRatings,
  addRating
} from '../controllers/characterController.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes (dapat diakses siapa saja)
router.get('/', getAllCharacters);
router.get('/:id', getCharacterById);
router.get('/:id/ratings', getCharacterRatings);
router.post('/:id/ratings', addRating);

// Admin only routes (hanya admin yang bisa mengakses)
router.post('/', isAdmin, addCharacter);
router.put('/:id', isAdmin, updateCharacter);
router.delete('/:id', isAdmin, deleteCharacter);

export default router;
