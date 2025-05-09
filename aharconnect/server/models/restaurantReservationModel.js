const mongoose = require('mongoose');

const restaurantReservationSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  maxCapacity: {
    type: Number,
    required: true
  },
  availableTimeSlots: [{
    startTime: String,
    endTime: String,
    isAvailable: Boolean
  }],
  bookingDuration: {
    type: Number, // in minutes
    default: 60
  },
  advanceBookingDays: {
    type: Number,
    default: 7
  },
  image: {
    type: String,
    default: '/uploads/placeholder-image.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
restaurantReservationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RestaurantReservation', restaurantReservationSchema);