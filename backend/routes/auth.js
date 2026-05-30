const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// ── SECURE EMAIL DISPATCH HELPERS ──
const sendEmailInternal = async (toEmail, toName, subject, htmlContent) => {
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
        subject: subject,
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('❌ Brevo API returned error status:', response.status, errText);
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Failed to dispatch email via Brevo:', error);
    return false;
  }
};

const sendWelcomeEmailServerSide = async (email, name) => {
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A2E; line-height: 1.6;">
        <h2 style="color: #1A1A2E; margin-bottom: 20px;">Dear ${name || "Customer"},</h2>
        <p style="font-size: 15px;">You've just joined something that's changing the way India gets its haircut.</p>
        <p style="font-size: 15px;">At Trimzy, we believe your time is too valuable to spend standing in a queue. So we built something better.</p>
        
        <h3 style="color: #E8A44A; margin-top: 30px; margin-bottom: 15px; font-size: 18px;">Here's what you now have access to:</h3>
        
        <ul style="list-style-type: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 15px;">
                <strong style="font-size: 15px; color: #1A1A2E;">⏱️ Real Time Queue Tracking</strong><br>
                <span style="font-size: 14px; color: #555;">No more sitting and waiting. See exactly when your turn is up, from home.</span>
            </li>
            <li style="margin-bottom: 15px;">
                <strong style="font-size: 15px; color: #1A1A2E;">✂️ Top Barbers In Your Area</strong><br>
                <span style="font-size: 14px; color: #555;">We've handpicked the best professionals. View their ratings and past work.</span>
            </li>
            <li style="margin-bottom: 15px;">
                <strong style="font-size: 15px; color: #1A1A2E;">🏠 Home Appointments (Beta)</strong><br>
                <span style="font-size: 14px; color: #555;">Select barbers now offer premium home visits right to your doorstep.</span>
            </li>
        </ul>

        <div style="margin: 35px 0;">
            <a href="https://trimzy.co.in/app.html" style="background: #E8A44A; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Book Your First Appointment →</a>
        </div>

        <p style="margin-top: 30px; color: #555; font-size: 14px;">
            We're excited to have you with us.<br>
            <strong style="color: #1A1A2E;">Prasant Kumar</strong><br>
            Founder, Trimzy
        </p>
    </div>
  `;
  await sendEmailInternal(email, name, "Welcome to Trimzy! ✂️", body);
};

const sendWelcomeBackEmailServerSide = async (email, name) => {
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A2E; line-height: 1.6;">
        <h2 style="color: #1A1A2E; margin-bottom: 20px;">Welcome back, ${name || "Customer"}!</h2>
        <p style="font-size: 15px;">We noticed you just logged into your Trimzy account.</p>
        <p style="font-size: 15px;">Ready for your next fresh cut? Your favorite barbers are just a few clicks away. Skip the queue and book a premium slot directly from the app.</p>
        
        <div style="margin: 35px 0;">
            <a href="https://trimzy.co.in/app.html" style="background: #E8A44A; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Book Your Next Appointment →</a>
        </div>

        <p style="margin-top: 30px; color: #555; font-size: 14px;">
            Warm regards,<br>
            <strong style="color: #1A1A2E;">Team Trimzy</strong>
        </p>
    </div>
  `;
  await sendEmailInternal(email, name, "Welcome Back to Trimzy! ✂️", body);
};

/**
 * @route   POST /api/auth/sync
 * @desc    Sync Firebase Auth user with MongoDB. Creates user if doesn't exist, updates if it does.
 * @access  Private (Firebase JWT)
 */
router.post('/sync', authLimiter, verifyToken, async (req, res) => {
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

      // Trigger welcome back email asynchronously for non-barber customer accounts
      if (user.email && user.role !== 'barber') {
        sendWelcomeBackEmailServerSide(user.email.toLowerCase(), user.name);
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

      // Trigger welcome email asynchronously for non-barber customer accounts
      if (user.email && user.role !== 'barber') {
        sendWelcomeEmailServerSide(user.email.toLowerCase(), user.name);
      }

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
 * @route   POST /api/auth/contact
 * @desc    Submit a contact message (secure server-side generated email layout)
 * @access  Public
 */
router.post('/contact', authLimiter, async (req, res) => {
  try {
    const { name, contact, subject, message } = req.body;

    if (!name || !contact || !message) {
      return res.status(400).json({ success: false, error: 'Name, contact info, and message are required' });
    }

    const safeName = String(name).trim().substring(0, 100);
    const safeContact = String(contact).trim().substring(0, 100);
    const safeSubject = subject ? String(subject).trim().substring(0, 150) : 'General Inquiry';
    const safeMessage = String(message).trim().substring(0, 1000);

    const emailContent = `
      <div style="font-family:sans-serif; max-width:600px; margin:0 auto; padding:20px; border:1px solid #eee; border-radius:10px;">
        <h2 style="color:#0E0E1A; border-bottom: 2px solid #E8A44A; padding-bottom: 10px;">New Message from Trimzy Contact Form</h2>
        <p style="font-size:15px; margin:10px 0;"><strong>Name:</strong> ${safeName}</p>
        <p style="font-size:15px; margin:10px 0;"><strong>Contact Info:</strong> ${safeContact}</p>
        <p style="font-size:15px; margin:10px 0;"><strong>Subject:</strong> ${safeSubject}</p>
        <div style="background:#F4F3F0; padding:15px; border-radius:8px; margin-top:20px;">
          <p style="margin:0; font-weight:bold; color:#0E0E1A;">Message Content:</p>
          <p style="margin-top:10px; color:#555; white-space:pre-wrap; line-height:1.6;">${safeMessage}</p>
        </div>
      </div>
    `;

    const success = await sendEmailInternal('trimzy.co.in@gmail.com', 'Prasant Kumar', `Trimzy Web Contact: ${safeSubject}`, emailContent);
    
    if (!success) {
      return res.status(500).json({ success: false, error: 'Email service currently unavailable.' });
    }

    return res.json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('❌ Error in POST /api/auth/contact:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
