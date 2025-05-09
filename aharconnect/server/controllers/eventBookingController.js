const EventBooking = require('../models/EventBooking');
const EventBookingService = require('../services/EventBookingService');
const MongoEventBookingRepository = require('../repositories/MongoEventBookingRepository');

// Initialize service with repository
const repository = new MongoEventBookingRepository();
const bookingService = new EventBookingService(repository);

exports.createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    res.json(booking);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventSpaceBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getEventSpaceBookings(req.params.eventSpaceId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id);
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { eventSpaceId, startDateTime, endDateTime } = req.query;
    const available = await bookingService.checkAvailability(
      eventSpaceId,
      new Date(startDateTime),
      new Date(endDateTime)
    );
    res.json({ available });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
