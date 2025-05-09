const mongoose = require('mongoose');
const { Schema } = mongoose;

// Inventory Requirement for Menu Items
const InventoryRequirementSchema = new Schema({
  inventoryItemId: { type: String, required: true },
  quantityRequired: { type: Number, required: true }
});

// Menu Item Schema - embedded in Restaurant
const MenuItemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  available: { type: Boolean, default: true },
  preparationTime: { type: Number }, // in minutes
  inventoryItems: [InventoryRequirementSchema]
});

// Order Item Schema - embedded in Order
const OrderItemSchema = new Schema({
  menuItemId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  specialInstructions: { type: String }
});

// Order Schema - embedded in Restaurant
const OrderSchema = new Schema({
  id: { type: String, required: true },
  customerId: { type: String },
  items: { type: [OrderItemSchema], required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  tableNumber: { type: Number },
  isDelivery: { type: Boolean, default: false },
  paymentStatus: { 
    type: String, 
    required: true, 
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  }
});

// Reservation Schema - embedded in Restaurant
const ReservationSchema = new Schema({
  id: { type: String, required: true },
  customerId: { type: String },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  partySize: { type: Number, required: true, min: 1 },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'confirmed', 'canceled', 'completed'],
    default: 'pending'
  },
  tableNumber: { type: Number },
  specialRequests: { type: String }
});

// Inventory Item Schema - embedded in Restaurant
const InventoryItemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  threshold: { type: Number, required: true },
  cost: { type: Number, required: true },
  supplier: { type: String, required: true },
  lastRestocked: { type: String }
});

// Opening Hours Schema - embedded in Restaurant
const OpeningHoursSchema = new Schema({
  opening: { type: String, required: true },
  closing: { type: String, required: true }
});

// Main Restaurant Schema
const RestaurantSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  cuisineType: { type: [String], required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'], required: true },
  openingHours: { type: OpeningHoursSchema, required: true },
  image: { type: String },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  capacity: { type: Number, required: true },
  availableForEvents: { type: Boolean, default: false },
  
  // Embedded collections
  menus: [MenuItemSchema],
  orders: [OrderSchema],
  reservations: [ReservationSchema],
  inventory: [InventoryItemSchema]
}, { timestamps: true });

// Create model
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;