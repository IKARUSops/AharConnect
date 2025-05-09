const express = require('express');
const router = express.Router();
const { getAllReservations, getReservationById } = require('../controllers/eventReservationController');

// This is the correct route setup
router.get('/all', (req, res, next) => {
  console.log('Received request for /api/event-reservations/all');
  next();
}, getAllReservations); // Accessible at: /api/event-reservations/all

router.get('/:id', getReservationById); // New route to fetch reservation by ID

module.exports = router;
