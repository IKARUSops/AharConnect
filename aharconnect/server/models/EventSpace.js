const mongoose = require('mongoose');

const eventSpaceSchema = new mongoose.Schema({
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
  }
}, {
  timestamps: true
});

const EventSpace = mongoose.model('EventSpace', eventSpaceSchema);

module.exports = EventSpace; 