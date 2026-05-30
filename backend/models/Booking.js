const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  barberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  serviceName: { type: String, required: true },
  price: { type: Number, required: true },
  mode: { type: String, enum: ['shop', 'home'], required: true },
  scheduledAt: { type: Date, required: true },
  
  customerName: { type: String },
  customerPhone: { type: String },
  notes: { type: String },
  address: { type: String }, // For home visits
  
  pin: { type: String, required: true }, // Verification PIN
  status: { type: String, enum: ['upcoming', 'in_progress', 'completed', 'cancelled'], default: 'upcoming' },
  
  isReviewed: { type: Boolean, default: false },
  
  // Denormalized data for faster frontend rendering
  barberName: { type: String },
  barberProfilePic: { type: String }
}, { timestamps: true });

// Compound index for booking slot verification and active bookings retrieval
bookingSchema.index({ barberId: 1, scheduledAt: 1, status: 1 });

// Index for quick queries on customer booking history
bookingSchema.index({ customerId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
