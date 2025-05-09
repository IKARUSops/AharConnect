const mongoose = require('mongoose');
const { Schema } = mongoose;

// Restaurant Cart Item Schema - embedded in Customer.cart.restaurantItems
const RestaurantCartItemSchema = new Schema({
  restaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
  itemId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

// Event Package Cart Item Schema - embedded in Customer.cart.eventPackages
const EventPackageCartItemSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, required: true },
  packageId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

// Cart Schema - embedded in Customer
const CartSchema = new Schema({
  restaurantItems: [RestaurantCartItemSchema],
  eventPackages: [EventPackageCartItemSchema]
});

// Restaurant Order Item Schema - embedded in Customer.restaurantOrders[].items
const RestaurantOrderItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

// Restaurant Order Schema - embedded in Customer.restaurantOrders
const RestaurantOrderSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  restaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
  items: [RestaurantOrderItemSchema],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderedAt: { type: Date, default: Date.now }
});

// Restaurant Reservation Schema - embedded in Customer.restaurantReservations
const RestaurantReservationSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  restaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1 },
  notes: { type: String },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  reservedAt: { type: Date, default: Date.now }
});

// Event Booking Schema - embedded in Customer.eventBookings
const EventBookingSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  eventId: { type: Schema.Types.ObjectId, required: true },
  eventName: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  duration: { type: Number, required: true }, // in hours
  guests: { type: Number, required: true, min: 1 },
  packageId: { type: Schema.Types.ObjectId, required: true },
  totalPrice: { type: Number, required: true },
  specialRequests: { type: String },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending'
  },
  bookedAt: { type: Date, default: Date.now }
});

// Main Customer Schema
const CustomerSchema = new Schema({
  fullName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  profileImage: { type: String },
  
  // Embedded collections
  cart: { type: CartSchema, default: { restaurantItems: [], eventPackages: [] } },
  restaurantOrders: [RestaurantOrderSchema],
  restaurantReservations: [RestaurantReservationSchema],
  eventBookings: [EventBookingSchema]
}, { timestamps: true });

// Create model
const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;