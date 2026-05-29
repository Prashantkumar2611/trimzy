require('dotenv').config();

// Global Error Handlers to prevent Node process from crashing
process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION! Shutting down gracefully...', err.name, err.message);
  console.error(err.stack);
  // Ideally, notify admin via email/slack here
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 UNHANDLED REJECTION! Shutting down gracefully...');
  console.error(reason);
  // Ideally, notify admin via email/slack here
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const { globalLimiter } = require('./middleware/rateLimiter');
app.use(cors());
app.use(globalLimiter);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Basic Route for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Trimzy Backend is running perfectly!' });
});

// Root Route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Trimzy API</h1><p>The backend is up and running.</p>');
});

// Import Routes
const authRoutes = require('./routes/auth');
const barberRoutes = require('./routes/barber');
const bookingRoutes = require('./routes/booking');
const reviewRoutes = require('./routes/review');
const adminRoutes = require('./routes/admin');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
