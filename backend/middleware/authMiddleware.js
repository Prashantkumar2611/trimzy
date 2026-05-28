const admin = require('firebase-admin');
const User = require('../models/User');

// Note: Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY 
// are set in your environment variables.
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Handle newline characters in the private key from .env
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
    })
  });
} catch (error) {
  console.log('Firebase Admin init error or already initialized', error.message);
}

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying auth token', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const verifyAdmin = async (req, res, next) => {
  // 1. Support direct administrative password authentication for simple dashboard UI clients
  const adminPassword = req.headers['x-admin-password'];
  const serverAdminPassword = process.env.ADMIN_PASSWORD || '@Myadminslot1';
  if (adminPassword && adminPassword === serverAdminPassword) {
    return next();
  }

  // 2. Fallback to Firebase JWT verification
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authorization required' });
  }

  await verifyToken(req, res, async () => {
    try {
      const email = req.user.email;
      const uid = req.user.uid;

      // Check if email is in the master admin list
      const masterAdmins = ['aalimhakim@gmail.com', 'singhkrsanjay0911@gmail.com'];
      if (email && masterAdmins.includes(email.toLowerCase())) {
        return next();
      }

      // Check user role in MongoDB database
      const dbUser = await User.findOne({ firebaseUid: uid });
      if (dbUser && dbUser.role === 'admin') {
        return next();
      }

      return res.status(403).json({ error: 'Forbidden: Admin authorization required' });
    } catch (err) {
      console.error('Admin middleware verification error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };

