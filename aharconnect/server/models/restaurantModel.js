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
    default: 0,
    min: 0,
    max: 5
  },
  priceRange: {
    type: String,
    enum: ['budget', 'moderate', 'upscale', 'high-end'],
    default: 'moderate'
  },
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
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

// Model methods
restaurantSchema.statics.findByUserId = async function(userId) {
  return this.findOne({ user: userId });
};

restaurantSchema.statics.createRestaurant = async function(restaurantData) {
  const restaurant = new this(restaurantData);
  return restaurant.save();
};

restaurantSchema.statics.updateRestaurant = async function(userId, updateData) {
  return this.findOneAndUpdate(
    { user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

restaurantSchema.statics.findActiveRestaurants = async function() {
  return this.find({ isActive: true });
};

restaurantSchema.statics.findByCuisine = async function(cuisine) {
  return this.find({ cuisine: cuisine, isActive: true });
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant; 