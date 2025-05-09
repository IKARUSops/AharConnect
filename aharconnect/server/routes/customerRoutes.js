const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');
const Venue = require('../models/Events');

// Middleware to get customer by ID (for demo, replace with auth in production)
async function getCustomer(req, res, next) {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    req.customer = customer;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Add item to cart
router.post('/:customerId/cart/add', getCustomer, async (req, res) => {
  try {
    const { restaurantId, itemId, name, quantity, price } = req.body;
    req.customer.cart.restaurantItems.push({ restaurantId, itemId, name, quantity, price });
    await req.customer.save();
    res.json({ cart: req.customer.cart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// View cart
router.get('/:customerId/cart', getCustomer, (req, res) => {
  res.json({ cart: req.customer.cart });
});

// Remove item from cart
router.delete('/:customerId/cart/remove', getCustomer, async (req, res) => {
  try {
    const { itemId } = req.body;
    req.customer.cart.restaurantItems = req.customer.cart.restaurantItems.filter(item => item.itemId.toString() !== itemId);
    await req.customer.save();
    res.json({ cart: req.customer.cart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Checkout
router.post('/:customerId/cart/checkout', getCustomer, async (req, res) => {
  try {
    // Move cart items to restaurantOrders
    const orderItems = req.customer.cart.restaurantItems.map(item => ({
      itemId: item.itemId,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));
    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const restaurantId = req.customer.cart.restaurantItems[0]?.restaurantId;
    if (!restaurantId) return res.status(400).json({ error: 'No restaurant selected' });

    // Add to customer's orders
    req.customer.restaurantOrders.push({
      restaurantId,
      items: orderItems,
      totalPrice,
      status: 'pending',
      orderedAt: new Date()
    });
    await req.customer.save();

    // Add to restaurant's orders
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
      restaurant.orders.push({
        id: new mongoose.Types.ObjectId().toString(),
        customerId: req.customer._id.toString(),
        items: orderItems.map(item => ({ menuItemId: item.itemId, quantity: item.quantity })),
        status: 'pending',
        totalAmount: totalPrice,
        createdAt: new Date()
      });
      await restaurant.save();
    }

    // Clear cart
    req.customer.cart.restaurantItems = [];
    await req.customer.save();

    res.json({ message: 'Checkout successful', orders: req.customer.restaurantOrders });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add restaurant reservation
router.post('/:customerId/restaurant-reservations', getCustomer, async (req, res) => {
  try {
    const { restaurantId, date, time, guests, notes } = req.body;
    // Add to customer's restaurantReservations
    const reservation = {
      restaurantId,
      date,
      time,
      guests,
      notes,
      status: 'pending',
      reservedAt: new Date()
    };
    req.customer.restaurantReservations.push(reservation);
    await req.customer.save();

    // Add to restaurant's reservations
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
      restaurant.reservations.push({
        id: new mongoose.Types.ObjectId().toString(),
        customerId: req.customer._id.toString(),
        customerName: req.customer.fullName,
        customerEmail: req.customer.email,
        customerPhone: req.customer.phone,
        date,
        time,
        partySize: guests,
        status: 'pending',
        specialRequests: notes
      });
      await restaurant.save();
    }
    res.json({ message: 'Reservation created', reservations: req.customer.restaurantReservations });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add event booking
router.post('/:customerId/event-bookings', getCustomer, async (req, res) => {
  try {
    const { eventId, eventName, date, startTime, duration, guests, packageId, totalPrice, specialRequests } = req.body;
    // Add to customer's eventBookings
    const booking = {
      eventId,
      eventName,
      date,
      startTime,
      duration,
      guests,
      packageId,
      totalPrice,
      specialRequests,
      status: 'pending',
      bookedAt: new Date()
    };
    req.customer.eventBookings.push(booking);
    await req.customer.save();

    // Add to eventspace's bookings
    const venue = await Venue.findById(eventId);
    if (venue) {
      venue.bookings.push({
        eventName,
        date,
        startTime,
        duration,
        guests,
        packageId,
        estimatedPrice: totalPrice,
        contact: {
          fullName: req.customer.fullName,
          email: req.customer.email,
          phone: req.customer.phone
        },
        specialRequests,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await venue.save();
    }
    res.json({ message: 'Event booking created', eventBookings: req.customer.eventBookings });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
