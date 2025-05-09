const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reservationController = require('../controllers/reservationController');

// Get reservation settings
router.get('/settings', authMiddleware, reservationController.getReservationSettings);

// Update reservation settings
router.put('/settings', authMiddleware, reservationController.updateReservationSettings);

// Toggle reservation availability
router.post('/toggle', authMiddleware, reservationController.toggleReservationAvailability);

module.exports = router; 