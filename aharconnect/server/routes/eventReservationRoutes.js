const express = require('express');
const router = express.Router();
const { getAllReservations } = require('../controllers/eventReservationController');

// This is the correct route setup
router.get('/all', (req, res, next) => {
  console.log('Received request for /api/event-reservations/all');
  next();
}, getAllReservations); // Accessible at: /api/event-reservations/all

module.exports = router;
