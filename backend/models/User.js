const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  time: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  role: { type: String, enum: ['customer', 'barber', 'admin'], default: 'customer' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  area: { type: String },
  initials: { type: String },
  
  // Barber specific fields
  shopName: { type: String },
  about: { type: String },
  profilePic: { type: String },
  salonPhotos: [{ type: String }],
  services: [serviceSchema],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isOpen: { type: Boolean, default: false },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  },
  homeVisit: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  upiId: { type: String }
}, { timestamps: true });

// Index for geospatial queries
userSchema.index({ location: '2dsphere' });

// Unique search index on email lookup
userSchema.index({ email: 1 });

// Compound index for approved barber searches and directory listings
userSchema.index({ role: 1, status: 1 });

module.exports = mongoose.model('User', userSchema);
