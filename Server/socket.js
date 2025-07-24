const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const User = require('./models/User');
const Group = require('./models/Group');

const connectedUsers = new Map(); // userId -> socket

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    connectedUsers.set(userId, socket);

    socket.emit('connected');

    socket.on('setup', (userData) => {
      socket.join(userId);
      socket.emit('setup_ack', { userId });
    });

    socket.on('join chat', (chatUserId) => {
      socket.join(chatUserId);
    });

    socket.on('join group', (groupId) => {
      socket.join(groupId);
    });

    socket.on('new message', async (data) => {
      // Save message to DB
      let message;
      if (data.groupId) {
        message = new Message({
          sender: userId,
          group: data.groupId,
          type: 'group',
          content: data.content,
          seenBy: [userId],
        });
        await message.save();
        io.to(data.groupId).emit('message received', message);
      } else if (data.recipientId) {
        message = new Message({
          sender: userId,
          receiver: data.recipientId,
          type: 'personal',
          content: data.content,
          seenBy: [userId],
        });
        await message.save();
        io.to(data.recipientId).emit('message received', message);
        io.to(userId).emit('message received', message);
      }
    });

    socket.on('typing', (roomId) => {
      socket.to(roomId).emit('typing', { userId });
    });
    socket.on('stop typing', (roomId) => {
      socket.to(roomId).emit('stop typing', { userId });
    });

    socket.on('disconnect', () => {
      socket.emit('disconnected');
      connectedUsers.delete(userId);
    });
  });

  return io;
}

module.exports = setupSocket;
