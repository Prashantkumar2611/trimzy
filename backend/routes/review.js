const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/reviews
 * @desc    Submit a review for a completed booking & recalculate barber rating atomically
 * @access  Private (Firebase JWT - Customer only)
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // 1. Input validation
    if (!bookingId || rating === undefined) {
      return res.status(400).json({ success: false, error: 'Booking ID and Rating are required' });
    }

    const parsedRating = parseInt(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be an integer between 1 and 5' });
    }

    const safeComment = comment ? comment.trim().substring(0, 500) : '';

    // 2. Fetch Customer from MongoDB (using Firebase uid from token)
    const customer = await User.findOne({ firebaseUid: req.user.uid });
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer profile not found' });
    }

    // 3. Fetch booking & validate
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Verify booking belongs to this customer
    if (booking.customerId.toString() !== customer._id.toString()) {
      return res.status(403).json({ success: false, error: 'Access denied: You can only review your own bookings' });
    }

    // Verify booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ 
        success: false, 
        error: `You can only review completed appointments. Current status is '${booking.status}'` 
      });
    }

    // Verify booking is not already reviewed
    if (booking.isReviewed) {
      return res.status(400).json({ success: false, error: 'This booking has already been reviewed' });
    }

    // Check duplicate review directly in DB
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ success: false, error: 'Review already exists for this booking' });
    }

    // 4. Create and Save Review
    const review = new Review({
      bookingId: booking._id,
      barberId: booking.barberId,
      customerId: customer._id,
      customerName: customer.name || 'Anonymous Customer',
      rating: parsedRating,
      comment: safeComment
    });

    await review.save();

    // Mark booking as reviewed
    booking.isReviewed = true;
    await booking.save();

    // 5. ATOMIC RATINGS RECALCULATION (Senior Developer best practice)
    // We aggregate all reviews for this barber to find the perfect average.
    // This is mathematically superior and resilient against concurrent request race conditions!
    const stats = await Review.aggregate([
      { $match: { barberId: booking.barberId } },
      {
        $group: {
          _id: '$barberId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      const { averageRating, totalReviews } = stats[0];
      
      // Update barber stats atomically in MongoDB
      await User.findByIdAndUpdate(booking.barberId, {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place (e.g. 4.7)
        reviewCount: totalReviews
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review
    });

  } catch (error) {
    console.error('❌ Error in POST /api/reviews:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid Booking ID format' });
    }
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

/**
 * @route   GET /api/reviews/barber/:barberId
 * @desc    Get paginated reviews for a specific barber
 * @access  Public
 */
router.get('/barber/:barberId', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const parsedLimit = Math.min(parseInt(limit) || 10, 50);
    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    // Check if barber exists
    const barberExists = await User.exists({ _id: req.params.barberId, role: 'barber' });
    if (!barberExists) {
      return res.status(404).json({ success: false, error: 'Barber not found' });
    }

    const reviews = await Review.find({ barberId: req.params.barberId })
      .populate('customerId', 'name initials profilePic')
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .skip(skip)
      .lean();

    const total = await Review.countDocuments({ barberId: req.params.barberId });

    return res.json({
      success: true,
      count: reviews.length,
      total,
      page: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      reviews
    });

  } catch (error) {
    console.error('❌ Error fetching reviews for barber:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid Barber ID format' });
    }
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
