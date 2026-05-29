const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking (securely validates barber services, price, and generates a server-side PIN)
 * @access  Private (Firebase JWT)
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { barberId, serviceName, mode, scheduledAt, customerPhone, notes, address } = req.body;

    // 1. Basic Inputs Validation
    if (!barberId || !serviceName || !mode || !scheduledAt) {
      return res.status(400).json({ success: false, error: 'Missing required booking fields' });
    }

    if (!['shop', 'home'].includes(mode)) {
      return res.status(400).json({ success: false, error: 'Invalid mode. Must be shop or home' });
    }

    if (mode === 'home' && (!address || address.trim() === '')) {
      return res.status(400).json({ success: false, error: 'Address is required for home visits' });
    }

    const bookingDate = new Date(scheduledAt);
    if (isNaN(bookingDate.getTime()) || bookingDate < new Date()) {
      return res.status(400).json({ success: false, error: 'Scheduled date must be a valid future date' });
    }

    // 2. Fetch Customer from MongoDB (using Firebase uid from token)
    const customer = await User.findOne({ firebaseUid: req.user.uid });
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer profile not found' });
    }

    // 3. Fetch Barber from MongoDB & validate status
    const barber = await User.findOne({ _id: barberId, role: 'barber' });
    if (!barber) {
      return res.status(404).json({ success: false, error: 'Barber not found' });
    }

    if (barber.status !== 'approved') {
      return res.status(400).json({ success: false, error: 'This barber is currently not active or approved' });
    }

    // Check homeVisit compatibility if home mode is requested
    if (mode === 'home' && !barber.homeVisit) {
      return res.status(400).json({ success: false, error: 'This barber does not offer home visits' });
    }

    // 4. Secure Server-Side Price Lookup
    const barberService = barber.services.find(
      s => s.name.toLowerCase() === serviceName.toLowerCase()
    );

    if (!barberService) {
      return res.status(400).json({ 
        success: false, 
        error: `Service '${serviceName}' is not offered by this barber.` 
      });
    }

    const servicePrice = barberService.price;
    const securePin = Math.floor(1000 + Math.random() * 9000).toString();

    let createdBooking;
    
    // 5. Start MongoDB Transaction to prevent double booking
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Check if slot is already booked for this barber at this exact time
      const existingBooking = await Booking.findOne({
        barberId: barber._id,
        scheduledAt: bookingDate,
        status: { $in: ['upcoming'] } // Only 'upcoming' blocks the slot. 'completed'/'cancelled' don't.
      }).session(session);

      if (existingBooking) {
        throw new Error('SLOT_TAKEN');
      }

      // 6. Create the Booking Document within the transaction
      const booking = new Booking({
        customerId: customer._id,
        barberId: barber._id,
        serviceName: barberService.name,
        price: servicePrice,
        mode,
        scheduledAt: bookingDate,
        customerName: customer.name,
        customerPhone: customerPhone || customer.phone || '',
        notes: notes || '',
        address: mode === 'home' ? address.trim() : '',
        pin: securePin,
        status: 'upcoming',
        isReviewed: false,
        barberName: barber.shopName || barber.name,
        barberProfilePic: barber.profilePic || ''
      });

      await booking.save({ session });
      createdBooking = booking;

      await session.commitTransaction();
    } catch (txError) {
      await session.abortTransaction();
      if (txError.message === 'SLOT_TAKEN') {
        return res.status(409).json({ success: false, error: 'This slot was just booked by someone else. Please select another time.' });
      }
      throw txError;
    } finally {
      session.endSession();
    }

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking: createdBooking
    });

  } catch (error) {
    console.error('❌ Error in POST /api/bookings:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid Barber ID format' });
    }
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

/**
 * @route   GET /api/bookings
 * @desc    Fetch bookings for current user (filters by role and status with pagination)
 * @access  Private (Firebase JWT)
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;

    const parsedLimit = Math.min(parseInt(limit) || 20, 100);
    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    // Find the MongoDB user corresponding to this token
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    const filter = {};
    let isBarber = false;

    // Determine query filter based on user role
    if (user.role === 'barber') {
      filter.barberId = user._id;
      isBarber = true;
    } else if (user.role === 'admin') {
      // Admins can see all bookings
    } else {
      filter.customerId = user._id;
    }

    if (status) {
      filter.status = status;
    }

    // Build the query projection
    // SECURITY: Barbers must NOT see the PIN. Customers need to see the PIN to tell the barber.
    let projection = '-__v';
    if (isBarber) {
      projection += ' -pin'; // Exclude PIN from response for barbers
    }

    const bookings = await Booking.find(filter)
      .populate('customerId', 'name email phone initials')
      .populate('barberId', 'name shopName email phone profilePic location')
      .sort({ scheduledAt: -1 })
      .limit(parsedLimit)
      .skip(skip)
      .select(projection);

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
    console.error('❌ Error fetching bookings:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @route   POST /api/bookings/:id/verify-pin
 * @desc    Start/Verify an upcoming booking session by verifying the customer's PIN (Barber only)
 * @access  Private (Firebase JWT - Barber only)
 */
router.post('/:id/verify-pin', verifyToken, async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ success: false, error: 'Verification PIN is required' });
    }

    // 1. Fetch barber profile from MongoDB
    const barber = await User.findOne({ firebaseUid: req.user.uid, role: 'barber' });
    if (!barber) {
      return res.status(403).json({ success: false, error: 'Access denied: User is not a barber' });
    }

    // 2. Fetch the Booking
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // 3. Confirm this booking is assigned to this barber
    if (booking.barberId.toString() !== barber._id.toString()) {
      return res.status(403).json({ success: false, error: 'Access denied: Booking is not assigned to you' });
    }

    // 4. Validate Booking status
    if (booking.status !== 'upcoming') {
      return res.status(400).json({ 
        success: false, 
        error: `Cannot start a booking that is currently ${booking.status}` 
      });
    }

    // 5. Compare PIN
    if (booking.pin !== pin.trim()) {
      return res.status(400).json({ success: false, error: 'Invalid PIN. Please check with customer.' });
    }

    // 6. Complete PIN verification and mark as in progress
    booking.status = 'in_progress';
    await booking.save();

    return res.json({
      success: true,
      message: 'PIN verified successfully! Booking is now in progress.',
      booking
    });

  } catch (error) {
    console.error('❌ Error verifying booking PIN:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid Booking ID format' });
    }
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @route   PUT /api/bookings/:id/status
 * @desc    Update booking status (cancel by customer/barber, complete by barber)
 * @access  Private (Firebase JWT)
 */
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid target status. Must be completed or cancelled' });
    }

    // Fetch Mongoose user profile
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const isCustomer = booking.customerId.toString() === user._id.toString();
    const isBarber = booking.barberId.toString() === user._id.toString();

    if (!isCustomer && !isBarber && user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized to modify this booking' });
    }

    // ── CANCEL Logic ──
    if (status === 'cancelled') {
      if (booking.status === 'completed' || booking.status === 'cancelled') {
        return res.status(400).json({ success: false, error: `Cannot cancel a booking that is already ${booking.status}` });
      }
      booking.status = 'cancelled';
      await booking.save();
      return res.json({ success: true, message: 'Booking cancelled successfully', booking });
    }

    // ── COMPLETE Logic (Barber or Admin only) ──
    if (status === 'completed') {
      if (!isBarber && user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Only the assigned barber can mark bookings as completed' });
      }

      if (booking.status !== 'in_progress' && booking.status !== 'upcoming') {
        return res.status(400).json({ success: false, error: `Cannot complete a booking that is ${booking.status}` });
      }

      // Note: If completing directly from 'upcoming' (skipping in_progress), we allow it but recommend PIN flow first
      booking.status = 'completed';
      await booking.save();
      return res.json({ success: true, message: 'Booking marked as completed!', booking });
    }

  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid Booking ID format' });
    }
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
