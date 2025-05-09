const mongoose = require('mongoose');
const { Schema } = mongoose;

// Package Schema (Subdocument)
const packageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  guestLimit: {
    type: Number,
    required: true
  },
  includes: [{
    type: String
  }],
  customizations: [{
    type: String
  }]
});

// Contact Schema (Subdocument for bookings)
const contactSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

// Booking Schema (Subdocument)
const bookingSchema = new Schema({
  eventName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  guests: {
    type: Number,
    required: true
  },
  packageId: {
    type: Schema.Types.ObjectId,
    ref: 'Package'
  },
  estimatedPrice: {
    type: Number,
    required: true
  },
  contact: {
    type: contactSchema,
    required: true
  },
  specialRequests: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending'
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

// Reservation Schema (Subdocument for table-like reservations)
const reservationSchema = new Schema({
  customerName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  guests: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  },
  confirmed: {
    type: Boolean,
    default: false
  }
});

// Main Venue Schema
const venueSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // or 'Restaurant' depending on your model structure
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  image: {
    type: String
  },
  capacity: {
    type: Number,
    required: true
  },
  amenities: [{
    type: String
  }],
  pricing: {
    hourlyRate: {
      type: Number,
      required: true
    },
    minimumHours: {
      type: Number,
      required: true
    }
  },
  packages: [packageSchema],
  bookings: [bookingSchema],
  reservations: [reservationSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically handle createdAt and updatedAt
});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;