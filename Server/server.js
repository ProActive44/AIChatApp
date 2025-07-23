// Entry point: Express app setup
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');

const morgan = require('morgan');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());


// Morgan logs HTTP requests to your console for easier debugging and traffic analysis.
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));


app.get('/', (req, res) => {
    res.send('Welcome to the AI Chat Server');
})

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/chat', chatRoutes);
app.use('/api/group', groupRoutes);

// Export app for testing
module.exports = app;

// Only start server if not in test mode
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}