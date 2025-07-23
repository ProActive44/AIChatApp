const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For personal chat
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },   // For group chat

  type: {
    type: String,
    enum: ['personal', 'group'],
    required: true
  },

  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },

  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// indexes for performance
messageSchema.index({ receiver: 1 });
messageSchema.index({ group: 1 });

module.exports = mongoose.model('Message', messageSchema);
