const RestaurantReservation = require('../models/restaurantReservationModel');
const Restaurant = require('../models/restaurantModel');

const getReservationSettings = async (req, res) => {
  try {
    const reservations = await RestaurantReservation.find({}).populate({
      path: 'restaurant',
      select: 'name description image address'
    });

    const transformedReservations = reservations.map(reservation => ({
      id: reservation._id,
      name: reservation.restaurant?.name || 'Event Space',
      description: reservation.restaurant?.description || 'Description not available',
      image: reservation.restaurant?.image || '/uploads/placeholder-image.jpg',
      capacity: reservation.maxCapacity,
      address: reservation.restaurant?.address || 'Address not available',
    }));

    res.status(200).json(transformedReservations);
  } catch (error) {
    console.error('Error fetching reservation settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateReservationSettings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const {
      isEnabled,
      maxCapacity,
      availableTimeSlots,
      bookingDuration,
      advanceBookingDays,
      eventRate
    } = req.body;

    let reservationSettings = await RestaurantReservation.findOne({ restaurant: restaurant._id });

    if (reservationSettings) {
      // Update existing settings
      reservationSettings = await RestaurantReservation.findOneAndUpdate(
        { restaurant: restaurant._id },
        {
          isEnabled,
          maxCapacity,
          availableTimeSlots,
          bookingDuration,
          advanceBookingDays,
          eventRate
        },
        { new: true }
      );
    } else {
      // Create new settings
      reservationSettings = new RestaurantReservation({
        restaurant: restaurant._id,
        user: req.user._id,
        isEnabled,
        maxCapacity,
        availableTimeSlots,
        bookingDuration,
        advanceBookingDays,
        eventRate
      });
      await reservationSettings.save();
    }

    res.json(reservationSettings);
  } catch (error) {
    console.error('Error updating reservation settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const toggleReservationAvailability = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    let reservationSettings = await RestaurantReservation.findOne({ restaurant: restaurant._id });
    
    if (!reservationSettings) {
      reservationSettings = new RestaurantReservation({
        restaurant: restaurant._id,
        user: req.user._id,
        maxCapacity: restaurant.capacity || 20,
        isEnabled: true
      });
    } else {
      reservationSettings.isEnabled = !reservationSettings.isEnabled;
    }

    await reservationSettings.save();
    res.json(reservationSettings);
  } catch (error) {
    console.error('Error toggling reservation availability:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getReservationSettings,
  updateReservationSettings,
  toggleReservationAvailability
};