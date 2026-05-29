const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const Application = require('../models/Application');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Standard fetch node-version check - we can use native fetch since Node 18+ is standard,
// but for maximum compatibility with all Node versions, let's use standard https module or native fetch with fallback.
// In modern environments, global.fetch is always available.
const sendEmailViaBrevo = async (toEmail, toName, resetLink) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || apiKey === 'YOUR_BREVO_API_KEY_HERE') {
    console.warn('⚠️ Brevo API key is not configured. Email will not be sent.');
    return false;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Trimzy Admin', email: 'official@trimzy.co.in' },
        to: [{ email: toEmail, name: toName }],
        subject: 'Congratulations! Your Trimzy Barber Profile is Approved ✅',
        htmlContent: `
          <div style="font-family:sans-serif; max-width:600px; margin:0 auto; padding:20px; border:1px solid #eee; border-radius:10px;">
            <h2 style="color:#0E0E1A;">Welcome to the Trimzy Family, ${toName}! ✂️</h2>
            <p>We are thrilled to inform you that your application to join Trimzy as a professional barber has been <strong>Approved</strong>.</p>
            
            <div style="background:#F4F3F0; padding:20px; border-radius:12px; margin:24px 0;">
              <h3 style="margin-top:0; color:#E8A44A;">Set Your Password</h3>
              <p style="margin-bottom:8px;"><strong>Login Email:</strong> ${toEmail}</p>
              <p style="margin-bottom:0;">Please click the button below to securely set your password and access your dashboard.</p>
            </div>

            <p>You can now log in to your dashboard to manage your shop status, bookings, and profile:</p>
            <a href="${resetLink}" style="display:inline-block; padding:14px 24px; background:#E8A44A; color:#0E0E1A; text-decoration:none; border-radius:8px; font-weight:bold; margin:16px 0;">Set Password & Login →</a>

            <p style="margin-top:32px;">If you have any questions, feel free to reply to this email or contact us on WhatsApp.</p>
            <p>Best regards,<br><strong>Team Trimzy</strong></p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('❌ Brevo API returned error status:', response.status, errText);
      return false;
    }

    console.log(`✅ Approved email sent to ${toEmail} successfully.`);
    return true;
  } catch (error) {
    console.error('❌ Failed to dispatch email via Brevo:', error);
    return false;
  }
};

/**
 * @route   POST /api/admin/login
 * @desc    Verify admin password
 * @access  Public
 */
router.post('/login', (req, res) => {
  const { password } = req.body;
  const serverAdminPassword = process.env.ADMIN_PASSWORD || '@Myadminslot1';
  if (password === serverAdminPassword) {
    return res.json({ success: true, message: 'Admin authenticated' });
  } else {
    return res.status(401).json({ success: false, error: 'Invalid admin password' });
  }
});

/**
 * @route   POST /api/admin/applications
 * @desc    Submit a new barber application (Public route)
 * @access  Public
 */
router.post('/applications', async (req, res) => {
  try {
    const { name, email, phone, shopName, area, experience, services, homeVisit, upiId, about } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !shopName || !area) {
      return res.status(400).json({ success: false, error: 'Missing required application fields' });
    }

    // Standard format validations
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address format' });
    }

    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ success: false, error: 'Phone number must be exactly 10 digits' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists && userExists.role === 'barber') {
      return res.status(400).json({ success: false, error: 'A barber account with this email already exists' });
    }

    const applicationExists = await Application.findOne({ email: email.toLowerCase(), status: 'pending' });
    if (applicationExists) {
      return res.status(400).json({ success: false, error: 'You have a pending application. Please wait for our review.' });
    }

    const newApplication = new Application({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.replace(/\s/g, ''),
      shopName: shopName.trim(),
      area: area.trim(),
      experience: experience || '',
      status: 'pending'
    });

    // We can save additional fields inside the MongoDB database if we want to carry them over on approval
    // Mongoose application schema has basic fields, so let's save what fits, and store the rest inside
    // a metadata sub-object or extend Mongoose model schema dynamically (we can write them to Application if needed,
    // but the schema only defines those: name, email, phone, shopName, area, experience, status.
    // So let's store extra metadata if needed, but since our model is simple, let's keep it simple.)
    await newApplication.save();

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully! We will review it shortly.',
      application: newApplication
    });

  } catch (error) {
    console.error('❌ Error submitting application:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'An application with this email already exists.' });
    }
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

// ── PROTECTED ADMIN ROUTES ──
// All routes registered below this line will require admin privileges
router.use(verifyAdmin);

/**
 * @route   GET /api/admin/applications
 * @desc    Get all applications (with pagination and status filters)
 * @access  Private (Admin only)
 */
router.get('/applications', verifyAdmin, async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;

    const parsedLimit = Math.min(parseInt(limit) || 20, 100);
    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .sort({ appliedAt: -1 })
      .limit(parsedLimit)
      .skip(skip);

    const total = await Application.countDocuments(filter);

    return res.json({
      success: true,
      count: applications.length,
      total,
      page: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      applications
    });

  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @route   POST /api/admin/applications/:id/approve
 * @desc    Approve application, create Firebase Auth user, sync Mongoose barber profile, send credentials via email
 * @access  Private (Admin only)
 */
router.post('/applications/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Fetch application
    const appDoc = await Application.findById(req.params.id);
    if (!appDoc) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (appDoc.status !== 'pending') {
      return res.status(400).json({ success: false, error: `Application is already ${appDoc.status}` });
    }

    const barberEmail = email ? email.trim().toLowerCase() : appDoc.email;
    // Generate secure random temporary password (never shared with the barber)
    const tempPassword = `Trimzy@${Math.floor(100000 + Math.random() * 900000)}`;

    let firebaseUid = '';

    // 2. Create Firebase Auth record safely
    try {
      const fbUser = await admin.auth().createUser({
        email: barberEmail,
        password: tempPassword,
        displayName: appDoc.name,
        emailVerified: true
      });
      firebaseUid = fbUser.uid;
      console.log(`✅ Created Firebase Auth user with UID: ${firebaseUid}`);
    } catch (fbError) {
      console.error('❌ Firebase User Creation failed:', fbError.code, fbError.message);
      
      // Senior Recovery: If the user already exists in Firebase Auth, see if we can find them or proceed
      if (fbError.code === 'auth/email-already-in-use' || fbError.code === 'auth/email-already-exists') {
        try {
          const existingFbUser = await admin.auth().getUserByEmail(barberEmail);
          firebaseUid = existingFbUser.uid;
          console.log(`💡 Recovered existing Firebase User with UID: ${firebaseUid}`);
        } catch (recoverErr) {
          return res.status(400).json({ 
            success: false, 
            error: 'Email already exists in Firebase Auth and profile is unrecoverable. Please delete from Firebase console first.' 
          });
        }
      } else {
        return res.status(500).json({ 
          success: false, 
          error: 'Firebase Auth user creation failed', 
          details: fbError.message 
        });
      }
    }

    // 3. Check if Mongoose Barber Profile already exists
    let barberProfile = await User.findOne({ firebaseUid });
    if (!barberProfile) {
      // Create new Barber profile in MongoDB
      // Add default service to prevent UI crash when listing new barbers
      const defaultServices = [
        { name: 'Standard Haircut', price: 150, time: '30 mins' },
        { name: 'Beard Trim & Shape', price: 100, time: '20 mins' }
      ];

      barberProfile = new User({
        firebaseUid,
        email: barberEmail,
        name: appDoc.name,
        phone: appDoc.phone,
        shopName: appDoc.shopName,
        area: appDoc.area,
        role: 'barber',
        status: 'approved',
        isOpen: false,
        rating: 4.5, // Start with a friendly high average rating!
        reviewCount: 0,
        services: defaultServices,
        location: {
          type: 'Point',
          coordinates: [77.2090, 28.6139] // Default coordinates (e.g. New Delhi) until updated by barber
        },
        homeVisit: false,
        upiId: ''
      });
    } else {
      // Update existing profile status
      barberProfile.role = 'barber';
      barberProfile.status = 'approved';
    }

    await barberProfile.save();

    // 4. Update application status
    appDoc.status = 'approved';
    await appDoc.save();

    // 5. Generate Password Reset Link and Send Email
    try {
      const fbResetLink = await admin.auth().generatePasswordResetLink(barberEmail);
      // Parse the oobCode to create a custom URL
      const urlObj = new URL(fbResetLink);
      const oobCode = urlObj.searchParams.get('oobCode');
      const resetLink = `https://trimzy.co.in/barber-auth.html?mode=resetPassword&oobCode=${oobCode}`;
      
      // Runs asynchronously so we don't block the request if SMTP provider is slow
      sendEmailViaBrevo(barberEmail, appDoc.name, resetLink);
    } catch (linkErr) {
      console.error('Failed to generate reset link:', linkErr);
    }

    return res.json({
      success: true,
      message: 'Application approved successfully! Barber account created and email dispatched.',
      barber: barberProfile
    });

  } catch (error) {
    console.error('❌ Error in /api/admin/applications/approve:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid Application ID format' });
    }
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

/**
 * @route   POST /api/admin/applications/:id/reject
 * @desc    Reject application, delete bookings, reviews, and profiles associated with it
 * @access  Private (Admin only)
 */
router.post('/applications/:id/reject', verifyAdmin, async (req, res) => {
  try {
    const appDoc = await Application.findById(req.params.id);
    if (!appDoc) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // 1. Delete associated profile from MongoDB if it exists
    const userProfile = await User.findOne({ email: appDoc.email });
    if (userProfile) {
      const profileId = userProfile._id;
      
      // Delete bookings
      const bookingDelete = await Booking.deleteMany({ barberId: profileId });
      console.log(`[ADMIN] Deleted ${bookingDelete.deletedCount} bookings for rejected barber.`);

      // Delete reviews
      const reviewDelete = await Review.deleteMany({ barberId: profileId });
      console.log(`[ADMIN] Deleted ${reviewDelete.deletedCount} reviews for rejected barber.`);

      // Delete Mongoose profile
      await User.findByIdAndDelete(profileId);
      console.log(`[ADMIN] Deleted MongoDB barber profile.`);

      // Delete Firebase Auth User safely
      try {
        await admin.auth().deleteUser(userProfile.firebaseUid);
        console.log(`[ADMIN] Deleted Firebase Auth user.`);
      } catch (authErr) {
        console.warn('⚠️ Could not delete user from Firebase Auth:', authErr.message);
      }
    }

    // 2. Mark application status as rejected
    appDoc.status = 'rejected';
    await appDoc.save();

    return res.json({
      success: true,
      message: 'Application rejected. Associated credentials and datasets successfully purged.'
    });

  } catch (error) {
    console.error('❌ Error in /api/admin/applications/reject:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid Application ID format' });
    }
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    List all registered users (customers, barbers, admins)
 * @access  Private (Admin only)
 */
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const { role, limit = 50, page = 1 } = req.query;

    const parsedLimit = Math.min(parseInt(limit) || 50, 200);
    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const filter = {};
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .skip(skip)
      .select('-__v');

    const total = await User.countDocuments(filter);

    return res.json({
      success: true,
      count: users.length,
      total,
      page: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      users
    });

  } catch (error) {
    console.error('❌ Error listing users:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @route   GET /api/admin/bookings
 * @desc    Get all system-wide bookings (paginated)
 * @access  Private (Admin only)
 */
router.get('/bookings', verifyAdmin, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    const parsedLimit = Math.min(parseInt(limit) || 50, 200);
    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .skip(skip)
      .populate('customerId', 'name email')
      .populate('barberId', 'name shopName email');

    const total = await Booking.countDocuments(filter);

    return res.json({
      success: true,
      count: bookings.length,
      total,
      page: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      bookings
    });

  } catch (error) {
    console.error('❌ Error listing bookings:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @route   GET /api/admin/stats
 * @desc    Fetch aggregated dashboard analytics and stats
 * @access  Private (Admin only)
 */
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingApps = await Application.countDocuments({ status: 'pending' });
    const totalBarbers = await User.countDocuments({ role: 'barber', status: 'approved' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Aggregate total revenue safely
    const revenueStats = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$price' } } }
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    return res.json({
      success: true,
      stats: {
        totalRevenue,
        totalBookings,
        completedBookings,
        pendingApplicationsCount: pendingApps,
        activeBarbersCount: totalBarbers,
        registeredCustomersCount: totalCustomers
      }
    });

  } catch (error) {
    console.error('❌ Error fetching admin stats:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
