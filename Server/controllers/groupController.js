const Group = require('../models/Group');
const User = require('../models/User');

// Create a group with multiple members
exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const creatorId = req.user.id;
    if (!name || !Array.isArray(members) || members.length < 2) {
      return res.status(400).json({ error: 'Group name and at least 2 members required.' });
    }
    // Ensure creator is in the group
    if (!members.includes(creatorId)) members.push(creatorId);
    const group = new Group({ name, members });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group.' });
  }
};
