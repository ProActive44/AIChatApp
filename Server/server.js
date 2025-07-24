// Entry point: Express app setup
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');

const morgan = require('morgan');

const http = require('http');
const setupSocket = require('./socket');

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

module.exports = { app, server, io };

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}