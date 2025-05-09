const express = require('express');
const router = express.Router();
const eventBookingController = require('../controllers/eventBookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with authentication
router.use(authMiddleware);

// Create a new booking
router.post('/', eventBookingController.createBooking);

// Get all bookings for current user
router.get('/user', eventBookingController.getUserBookings);

// Get all bookings for an event space
router.get('/event-space/:eventSpaceId', eventBookingController.getEventSpaceBookings);

// Get a specific booking
router.get('/:id', eventBookingController.getBooking);

// Update a booking
router.put('/:id', eventBookingController.updateBooking);

// Cancel a booking
router.patch('/:id/cancel', eventBookingController.cancelBooking);

// Check availability for an event space
router.get('/check-availability', eventBookingController.checkAvailability);

module.exports = router;
