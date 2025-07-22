// User model for authentication and profile
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  username: { type: String },
  avatar: { type: String },
  bio: { type: String },
  online: { type: Boolean, default: false },
  lastSeen: { type: Date },
});

module.exports = mongoose.model('User', userSchema);
