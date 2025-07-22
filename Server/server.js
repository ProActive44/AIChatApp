// Entry point: Express app setup
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const morgan = require('morgan');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('combined')); // Logs requests in production format

app.get('/', (req, res) => {
    res.send('Welcome to the AI Chat Server');
})

// Routes
app.use('/api/auth', authRoutes);

// Export app for testing
module.exports = app;

// Only start server if not in test mode
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}