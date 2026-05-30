require('dotenv').config();

// Validate crucial environment variables on boot
const requiredEnvVars = [
  'MONGODB_URI',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`🔥 CRITICAL ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.ADMIN_PASSWORD) {
    console.error('🔥 CRITICAL PRODUCTION ERROR: ADMIN_PASSWORD is not defined in the environment!');
    process.exit(1);
  }
} else {
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('⚠️ WARNING: ADMIN_PASSWORD is not defined in your local .env file. Direct admin API actions will fall back to local development defaults.');
  }
}

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
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable proxy trust to support client IP extraction for rate-limiting behind proxies
app.set('trust proxy', 1);

// Middleware
const { globalLimiter } = require('./middleware/rateLimiter');
// CORS Configuration (Production Security)
const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV !== 'production') {
      // Allow all in development
      return callback(null, true);
    }
    
    // In production, restrict to FRONTEND_URL or allow requests with no origin (like Postman or mobile apps if needed)
    // NOTE: You must set FRONTEND_URL in your Render environment variables (e.g., https://trimzy.vercel.app)
    const allowedOrigins = [process.env.FRONTEND_URL];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked]: Request from unauthorized origin: ${origin}`);
      callback(new Error('CORS Policy Violation: Not allowed by Access-Control-Allow-Origin'));
    }
  },
  credentials: true
};
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(globalLimiter);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000
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

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🔥 Global Error Caught:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful Shutdown Hook
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ HTTP server closed.');
    // Check if mongoose connection is ready before trying to close it
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close(false).then(() => {
        console.log('✅ MongoDB connection closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});
