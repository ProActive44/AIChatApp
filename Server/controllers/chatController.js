const Message = require('../models/Message');
const User = require('../models/User');
const Group = require('../models/Group');

// Send a message (personal or group)
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, groupId, content } = req.body;
    const senderId = req.user.userId;
    if (!content || (!recipientId && !groupId)) {
      return res.status(400).json({ error: 'Content and recipient/group required.' });
    }
    let message;
    if (recipientId) {
      // Personal chat
      message = new Message({
        sender: senderId,
        recipient: recipientId,
        content,
        type: 'personal',
        isGroup: false,
      });
    } else {
      // Group chat
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ error: 'Group not found.' });
      message = new Message({
        sender: senderId,
        group: groupId,
        type: 'group',
        content,
        isGroup: true,
      });
    }
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message.', err: err.message });
  }
};

// Fetch personal chat messages between two users
exports.getPersonalMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const otherUserId = req.params.userId;
    const messages = await Message.find({
      isGroup: false,
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
};

// Fetch group chat messages by group ID
exports.getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found.' });
    const messages = await Message.find({ group: groupId, isGroup: true }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch group messages.' });
  }
};
