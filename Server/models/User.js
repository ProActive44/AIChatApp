// User model for authentication and profile
import mongoose from 'mongoose';

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


const User = mongoose.model('User', userSchema);
export default User;
