const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  openingHours: {
    opening: {
      type: String,
      required: true
    },
    closing: {
      type: String,
      required: true
    }
  },
  cuisine: [{
    type: String
  }],
  capacity: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  availableForEvents: {
    type: Boolean,
    default: false
    }
}, {
  timestamps: true
});
  
module.exports = mongoose.model('Restaurant', restaurantSchema); 