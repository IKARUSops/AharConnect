const RestaurantReservation = require('../models/restaurantReservationModel');
const Restaurant = require('../models/restaurantModel');

// Get reservation settings for a restaurant
exports.getReservationSettings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    let reservationSettings = await RestaurantReservation.findOne({ restaurant: restaurant._id });
    
    if (!reservationSettings) {
      // Create default settings if none exist
      reservationSettings = new RestaurantReservation({
        restaurant: restaurant._id,
        user: req.user._id,
        maxCapacity: restaurant.capacity || 20,
        availableTimeSlots: [
          {
            startTime: restaurant.openingHours?.opening || '09:00',
            endTime: restaurant.openingHours?.closing || '22:00',
            isAvailable: true
          }
        ]
      });
      await reservationSettings.save();
    }

    res.json(reservationSettings);
  } catch (error) {
    console.error('Error fetching reservation settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update reservation settings
exports.updateReservationSettings = async (req, res) => {
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
      advanceBookingDays
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
          advanceBookingDays
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
        advanceBookingDays
      });
      await reservationSettings.save();
    }

    res.json(reservationSettings);
  } catch (error) {
    console.error('Error updating reservation settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Toggle reservation availability
exports.toggleReservationAvailability = async (req, res) => {
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