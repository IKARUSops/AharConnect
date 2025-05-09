const mongoose = require('mongoose');

const eventPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  maxCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  amenities: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
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
eventPackageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const EventPackage = mongoose.model('EventPackage', eventPackageSchema);

module.exports = EventPackage; 