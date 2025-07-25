import Group from '../models/Group.js';
import User from '../models/User.js';

// Create a group with multiple members
export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const creatorId = req.user.userId;
    if (!name || !Array.isArray(members) || members.length < 2) {
      return res.status(400).json({ error: 'Group name and at least 2 members required.' });
    }
    // Ensure creator is in the group
    if (!members.includes(creatorId)) members.push(creatorId);
    const group = new Group({ name, members, createdBy: creatorId });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group.' });
  }
};
