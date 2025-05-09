const mongoose = require('mongoose');

const eventBookingSchema = new mongoose.Schema({
  eventSpaceId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  restaurantId: {
    type: String,
    required: true
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  specialRequests: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EventBooking', eventBookingSchema);
