import express from 'express';
import { signup, login, checkAdmin } from '../controllers/authController.js';

const router = express.Router();

// Signup
router.post('/signup', signup);

// Login
router.post('/login', login);

// Check if admin
router.post('/check-admin', checkAdmin);

export default router;
