import express from 'express';
import {
  getAllWeapons,
  getWeaponById,
  addWeapon,
  updateWeapon,
  deleteWeapon
} from '../controllers/weaponsController.js';

const router = express.Router();

// Public routes
router.get('/', getAllWeapons);
router.get('/:id', getWeaponById);

// Admin only routes
router.post('/', addWeapon);
router.put('/:id', updateWeapon);
router.delete('/:id', deleteWeapon);

export default router;
