const EventBookingService = require('../services/EventBookingService');
const MongoEventBookingRepository = require('../repositories/MongoEventBookingRepository');

// Initialize the service with MongoDB repository
const bookingService = new EventBookingService(new MongoEventBookingRepository());

exports.createBooking = async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      userId: req.user.id, // Assuming user ID is set by auth middleware
      startDateTime: new Date(req.body.startDateTime),
      endDateTime: new Date(req.body.endDateTime)
    };

    const booking = await bookingService.createBooking(bookingData);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    res.json(booking);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getEventSpaceBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getEventSpaceBookings(req.params.eventSpaceId);
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      startDateTime: req.body.startDateTime ? new Date(req.body.startDateTime) : undefined,
      endDateTime: req.body.endDateTime ? new Date(req.body.endDateTime) : undefined
    };

    const booking = await bookingService.updateBooking(req.params.id, bookingData);
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id);
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { eventSpaceId, startDateTime, endDateTime } = req.query;
    const isAvailable = await bookingService.checkAvailability(
      eventSpaceId,
      new Date(startDateTime),
      new Date(endDateTime)
    );
    res.json({ isAvailable });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
