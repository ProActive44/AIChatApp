// Auth routes: signup, login, logout
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', authController.signup); // Register
router.post('/login', authController.login);   // Login
router.post('/logout', authMiddleware, authController.logout); // Logout (protected)

module.exports = router;
