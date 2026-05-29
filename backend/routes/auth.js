const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/sync
 * @desc    Sync Firebase Auth user with MongoDB. Creates user if doesn't exist, updates if it does.
 * @access  Private (Firebase JWT)
 */
router.post('/sync', verifyToken, async (req, res) => {
  try {
    const { uid, email, email_verified } = req.user;
    const { name, phone, area, initials, role } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required from Auth token' });
    }

    // Check if user already exists in MongoDB
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      // Update existing user fields if provided in request body
      let updated = false;
      if (name && user.name !== name) { user.name = name; updated = true; }
      if (phone && user.phone !== phone) { user.phone = phone; updated = true; }
      if (area && user.area !== area) { user.area = area; updated = true; }
      if (initials && user.initials !== initials) { user.initials = initials; updated = true; }
      
      // Do not allow regular users to change their role to admin arbitrarily
      if (role && ['customer', 'barber'].includes(role) && user.role !== role) {
        // Only allow switching to barber if approved, or if they are currently a customer
        if (role === 'barber') {
          // If role is changing to barber, ensure they have proper fields or wait for admin approval
          // For now, let them set it if they are registering as a barber, but keep status check
          user.role = role;
          updated = true;
        } else {
          user.role = role;
          updated = true;
        }
      }

      if (updated) {
        await user.save();
      }
      return res.json({ success: true, user, isNew: false });
    } else {
      // Create new user in MongoDB
      const newUserRole = role && ['customer', 'barber', 'admin'].includes(role) ? role : 'customer';
      
      // Calculate initials if not provided
      const userInitials = initials || (name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'U');

      user = new User({
        firebaseUid: uid,
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        phone: phone || '',
        area: area || '',
        initials: userInitials,
        role: newUserRole,
        // Default barber fields if the role is barber
        ...(newUserRole === 'barber' ? {
          status: 'pending', // Barber starts as pending until approved
          isOpen: false,
          rating: 0,
          reviewCount: 0,
          services: [],
          salonPhotos: []
        } : {})
      });

      await user.save();
      return res.status(201).json({ success: true, user, isNew: true });
    }
  } catch (error) {
    console.error('❌ Error in /api/auth/sync:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user's profile from MongoDB
 * @access  Private (Firebase JWT)
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found in MongoDB' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @route   POST /api/auth/send-email
 * @desc    Securely send an email via Brevo
 * @access  Public
 */
router.post('/send-email', async (req, res) => {
  try {
    const { toEmail, toName, subject, htmlContent } = req.body;
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey || apiKey === 'YOUR_BREVO_API_KEY_HERE') {
      console.warn('⚠️ Brevo API key missing. Cannot send email.');
      return res.status(500).json({ success: false, error: 'Email service misconfigured' });
    }

    const fetchRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Trimzy Admin', email: 'official@trimzy.co.in' },
        to: [{ email: toEmail, name: toName }],
        subject: subject,
        htmlContent: htmlContent
      })
    });

    if (!fetchRes.ok) {
      const errorData = await fetchRes.text();
      throw new Error(`Brevo API Error: ${errorData}`);
    }

    const data = await fetchRes.json();
    return res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

module.exports = router;
