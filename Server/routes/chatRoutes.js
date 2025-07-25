import express from 'express';
import { sendMessage, getPersonalMessages, getGroupMessages, markMessagesSeen } from '../controllers/chatController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Group from '../models/Group.js';
const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// Get all users (for chat sidebar)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Get all groups (for chat sidebar)
router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find({});
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch groups.' });
  }
});

// Send message (personal or group)
router.post('/send', sendMessage);

// Mark messages as seen
router.post('/seen', markMessagesSeen);

// Get personal chat messages between two users
router.get('/personal/:userId', getPersonalMessages);

// Get group chat messages by group ID
router.get('/group/:groupId', getGroupMessages);

export default router;
