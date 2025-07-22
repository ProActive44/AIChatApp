// User model for authentication and profile
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true // Store hashed password
  },
  username: {
    type: String,
    // required: true,
    unique: true,
    trim: true
  },
  avatar: {
    type: String // URL to avatar image
  },
  bio: {
    type: String
  },
  online: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isBot: {
    type: Boolean,
    default: false // for AI users like chatbot
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }]
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
