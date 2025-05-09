const mongoose = require('mongoose');

const eventReservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  availability: {
    type: String,
    enum: ['Available', 'Not Available'],
    default: 'Available'
  },
  amenities: [String],
  images: [String],
  address: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  minHours: {
    type: Number,
    default: 1
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
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
eventReservationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('EventReservation', eventReservationSchema);