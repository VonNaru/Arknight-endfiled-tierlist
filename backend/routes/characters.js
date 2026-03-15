import express from 'express';
import {
  getAllCharacters,
  getCharacterById,
  addCharacter,
  updateCharacter,
  deleteCharacter,
  getCharacterRatings,
  addRating,
  getCharacterSkills
} from '../controllers/characterController.js';

const router = express.Router();

// Public routes (dapat diakses siapa saja)
router.get('/', getAllCharacters);
router.get('/skills/:characterId', getCharacterSkills);
router.get('/:id', getCharacterById);
router.get('/:id/ratings', getCharacterRatings);
router.post('/:id/ratings', addRating);

// Admin only routes (hanya admin yang bisa mengakses)
router.post('/', addCharacter);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

export default router;
