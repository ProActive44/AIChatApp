import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';

import connectDB from './config/db.js';
import setupSocket from './socket.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import groupRoutes from './routes/groupRoutes.js';

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));
app.get('/', (req, res) => {
  res.send('Welcome to the AI Chat Server');
});
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/group', groupRoutes);
const server = http.createServer(app);
const io = setupSocket(server);
export { app, server, io };
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
