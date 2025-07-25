// Auth routes: signup, login, logout
import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/signup', signup); // Register
router.post('/login', login);   // Login
router.post('/logout', authMiddleware, logout); // Logout (protected)

export default router;
