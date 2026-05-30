const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/barbers
 * @desc    Get all approved barbers (supports geospatial near queries, pagination, search filters)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { lat, lng, maxDistance, area, homeVisit, limit = 20, page = 1 } = req.query;
    
    // Build query filter
    const filter = {
      role: 'barber',
      status: 'approved' // Enforce approved-only for production
    };

    if (area) {
      filter.area = new RegExp(area, 'i'); // Case-insensitive matching
    }

    if (homeVisit === 'true') {
      filter.homeVisit = true;
    }

    // Pagination limits
    const parsedLimit = Math.min(parseInt(limit) || 20, 100); // Caps at 100 to prevent DOS/OOM
    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    // Handle geospatial query if coordinates are provided
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ success: false, error: 'Invalid latitude or longitude format' });
      }

      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return res.status(400).json({ success: false, error: 'Coordinates out of range (Lat: -90 to 90, Lng: -180 to 180)' });
      }

      // Max distance in meters (default 50km if not provided to match frontend)
      const distInMeters = parseFloat(maxDistance) || 50000;

      // In Mongoose/MongoDB, we can use $near to find closest barbers
      const barbers = await User.find({
        ...filter,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude] // Note: GeoJSON is [lng, lat]
            },
            $maxDistance: distInMeters
          }
        }
      })
      .limit(parsedLimit)
      .skip(skip)
      .select('-__v')
      .lean(); // Exclude mongoose internal fields

      const total = await User.countDocuments(filter);

      return res.json({
        success: true,
        count: barbers.length,
        total,
        page: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
        barbers
      });
    }

    // Default non-geospatial query
    const barbers = await User.find(filter)
      .sort({ rating: -1, reviewCount: -1 }) // Sort by rating/reviews as fallback
      .limit(parsedLimit)
      .skip(skip)
      .select('-__v')
      .lean();

    const total = await User.countDocuments(filter);

    return res.json({
      success: true,
      count: barbers.length,
      total,
      page: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      barbers
    });

  } catch (error) {
    console.error('❌ Error in GET /api/barbers:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

/**
 * @route   GET /api/barbers/:id
 * @desc    Get detailed profile of a single barber
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const barber = await User.findOne({ _id: req.params.id, role: 'barber' }).select('-__v').lean();
    if (!barber) {
      return res.status(404).json({ success: false, error: 'Barber profile not found' });
    }
    return res.json({ success: true, barber });
  } catch (error) {
    console.error('❌ Error fetching barber by ID:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid Barber ID format' });
    }
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @route   PUT /api/barbers/profile
 * @desc    Update barber profile (own profile only)
 * @access  Private (Firebase JWT)
 */
router.put('/profile', verifyToken, async (req, res) => {
  try {
    // Confirm the requesting user is a barber
    const barber = await User.findOne({ firebaseUid: req.user.uid, role: 'barber' });
    if (!barber) {
      return res.status(403).json({ success: false, error: 'Access denied: User is not registered as a barber' });
    }

    const {
      shopName,
      about,
      profilePic,
      salonPhotos,
      services,
      isOpen,
      latitude,
      longitude,
      homeVisit,
      upiId,
      address
    } = req.body;

    // Update simple fields if provided
    if (shopName !== undefined) barber.shopName = shopName.trim();
    if (about !== undefined) barber.about = about.trim();
    if (profilePic !== undefined) barber.profilePic = profilePic;
    if (salonPhotos !== undefined) {
      if (!Array.isArray(salonPhotos)) {
        return res.status(400).json({ success: false, error: 'salonPhotos must be an array of image URLs' });
      }
      barber.salonPhotos = salonPhotos;
    }
    if (isOpen !== undefined) barber.isOpen = !!isOpen;
    if (homeVisit !== undefined) barber.homeVisit = !!homeVisit;
    if (upiId !== undefined) barber.upiId = upiId.trim();

    // Handle structured address
    if (address !== undefined && typeof address === 'object') {
      barber.address = {
        street: address.street ? address.street.trim() : '',
        city: address.city ? address.city.trim() : '',
        state: address.state ? address.state.trim() : '',
        pincode: address.pincode ? address.pincode.trim() : ''
      };
      // Also update the generic 'area' field used for customer filtering
      if (barber.address.city) {
        barber.area = barber.address.city;
      }
    }

    // Handle location coordinates update safely
    if (latitude !== undefined && longitude !== undefined) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ success: false, error: 'Invalid coordinate values' });
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({ success: false, error: 'Coordinates out of bounds' });
      }

      barber.location = {
        type: 'Point',
        coordinates: [lng, lat] // [longitude, latitude]
      };
    }

    // Handle services update with input validation
    if (services !== undefined) {
      if (!Array.isArray(services)) {
        return res.status(400).json({ success: false, error: 'Services must be an array' });
      }

      const validatedServices = [];
      for (const service of services) {
        if (!service.name || typeof service.name !== 'string' || service.name.trim() === '') {
          return res.status(400).json({ success: false, error: 'Each service must have a valid name' });
        }
        
        const price = parseFloat(service.price);
        if (isNaN(price) || price < 0) {
          return res.status(400).json({ success: false, error: `Invalid price for service: ${service.name}` });
        }

        if (!service.time || typeof service.time !== 'string') {
          return res.status(400).json({ success: false, error: `Time estimate is required for service: ${service.name}` });
        }

        validatedServices.push({
          name: service.name.trim(),
          price: price,
          time: service.time.trim()
        });
      }
      barber.services = validatedServices;
    }

    await barber.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      barber
    });

  } catch (error) {
    console.error('❌ Error updating barber profile:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

/**
 * @route   DELETE /api/barbers/profile
 * @desc    Delete barber profile completely (from Firebase Auth and MongoDB)
 * @access  Private (Firebase JWT)
 */
router.delete('/profile', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    // 1. Find the barber in MongoDB
    const barber = await User.findOne({ firebaseUid: uid, role: 'barber' });
    if (!barber) {
      return res.status(404).json({ success: false, error: 'Barber profile not found' });
    }

    // 2. Delete the user from Firebase Auth using Admin SDK
    const admin = require('firebase-admin');
    try {
      await admin.auth().deleteUser(uid);
      console.log(`Successfully deleted Firebase Auth user: ${uid}`);
    } catch (fbError) {
      console.error('Error deleting Firebase Auth user:', fbError);
      // We will continue to delete from MongoDB even if Firebase deletion fails
      // (e.g., if the user was already deleted from Firebase somehow)
    }

    // 3. Delete the user document from MongoDB
    await User.deleteOne({ firebaseUid: uid });
    console.log(`Successfully deleted MongoDB user document for UID: ${uid}`);

    // (Optional: Delete associated reviews and bookings here if desired)
    
    return res.json({
      success: true,
      message: 'Barber account deleted permanently from all databases.'
    });

  } catch (error) {
    console.error('❌ Error deleting barber profile:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
