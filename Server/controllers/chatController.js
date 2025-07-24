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
        receiver: recipientId,
        content,
        type: 'personal',
        seenBy: [senderId],
      });
    } else {
      // Group chat
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ error: 'Group not found.' });

      message = new Message({
        sender: senderId,
        group: groupId,
        content,
        type: 'group',
        seenBy: [senderId],
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
      type: 'personal',
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

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

    const messages = await Message.find({ group: groupId, type: 'group' })
      .sort({ timestamp: 1 })
      .populate('sender', 'username avatar'); 

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch group messages.' });
  }
};


// Mark messages as seen (for personal or group chat)
exports.markMessagesSeen = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageIds } = req.body; // array of message IDs

    if (!Array.isArray(messageIds)) {
      return res.status(400).json({ error: 'messageIds must be an array.' });
    }

    await Message.updateMany(
      { _id: { $in: messageIds }, seenBy: { $ne: userId } },
      { $addToSet: { seenBy: userId } }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark messages as seen.' });
  }
};
