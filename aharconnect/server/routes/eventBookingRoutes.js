const express = require('express');
const router = express.Router();
const eventBookingController = require('../controllers/eventBookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with authentication
router.use(authMiddleware);

// Get event packages for a restaurant
router.get('/event-packages/:restaurantId', eventBookingController.getEventPackages);

// Check availability for an event space
router.get('/check-availability', eventBookingController.checkAvailability);

// Get all bookings for current user
router.get('/user', eventBookingController.getUserBookings);

// Get all bookings for a restaurant
router.get('/restaurant/:restaurantId', eventBookingController.getRestaurantBookings);

// Get all bookings for an event space
router.get('/event-space/:eventSpaceId', eventBookingController.getEventSpaceBookings);

// Create a new booking
router.post('/', eventBookingController.createBooking);

// Routes with :id parameter
router.get('/:id', eventBookingController.getBooking);
router.put('/:id', eventBookingController.updateBooking);
router.patch('/:id/cancel', eventBookingController.cancelBooking);
router.patch('/:id/approve', eventBookingController.approveBooking);
router.delete('/:id', eventBookingController.deleteBooking);

module.exports = router;
