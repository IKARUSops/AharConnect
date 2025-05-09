const mongoose = require('mongoose');

const eventBookingSchema = new mongoose.Schema({
  eventSpaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventSpace',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
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
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  eventPackageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventPackage'
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  specialRequests: {
    type: String
  },
  bookingRef: {
    type: String,
    unique: true,
    default: () => Math.random().toString(36).substring(2, 10).toUpperCase()
  }
}, {
  timestamps: true
});

// Add indexes for frequent queries
eventBookingSchema.index({ eventSpaceId: 1, startDateTime: 1, endDateTime: 1 });
eventBookingSchema.index({ userId: 1 });
eventBookingSchema.index({ restaurantId: 1 });
eventBookingSchema.index({ status: 1 });

// Add method to check if a time slot is available
eventBookingSchema.statics.isTimeSlotAvailable = async function(eventSpaceId, startDateTime, endDateTime, excludeBookingId = null) {
  const query = {
    eventSpaceId,
    status: { $ne: 'cancelled' },
    $or: [
      { 
        startDateTime: { $lt: endDateTime },
        endDateTime: { $gt: startDateTime }
      }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlappingBookings = await this.find(query);
  return overlappingBookings.length === 0;
};

const EventBooking = mongoose.model('EventBooking', eventBookingSchema);

module.exports = EventBooking;
