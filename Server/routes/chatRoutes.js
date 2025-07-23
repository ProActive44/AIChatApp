const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes
router.use(authMiddleware);

// Get all users (for chat sidebar)
router.get('/users', async (req, res) => {
  try {
    const users = await require('../models/User').find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Get all groups (for chat sidebar)
router.get('/groups', async (req, res) => {
  try {
    const groups = await require('../models/Group').find({});
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch groups.' });
  }
});

// Send message (personal or group)
router.post('/send', chatController.sendMessage);

// Mark messages as seen
router.post('/seen', chatController.markMessagesSeen);

// Get personal chat messages between two users
router.get('/personal/:userId', chatController.getPersonalMessages);

// Get group chat messages by group ID
router.get('/group/:groupId', chatController.getGroupMessages);

module.exports = router;
