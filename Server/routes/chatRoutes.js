const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes
router.use(authMiddleware);

// Send message (personal or group)
router.post('/send', chatController.sendMessage);

// Get personal chat messages between two users
router.get('/personal/:userId', chatController.getPersonalMessages);

// Get group chat messages by group ID
router.get('/group/:groupId', chatController.getGroupMessages);

module.exports = router;
