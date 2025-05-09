const RestaurantReservation = require('../models/restaurantReservationModel');
const Restaurant = require('../models/restaurantModel');

const getAllReservations = async (req, res) => {
  try {
    console.log('Fetching all reservations from the database...');
    const reservations = await RestaurantReservation.find({}).populate('restaurant'); // Fetch data and populate restaurant details

    // Transform the data to match the frontend's expected structure
    const transformedReservations = reservations.map(reservation => ({
      id: reservation._id,
      name: reservation.restaurant?.name || 'Event Space',
      description: reservation.restaurant?.description || 'Description not available',
      pricePerHour: 100, // Placeholder price
      availability: reservation.isEnabled ? 'Available' : 'Not Available',
      amenities: ['Wi-Fi', 'Air Conditioning'], // Placeholder amenities
      images: [reservation.restaurant?.image || '/uploads/placeholder-image.jpg'],
      address: reservation.restaurant?.address || 'Address not available',
      capacity: reservation.maxCapacity,
      minHours: 1, // Placeholder minimum hours
      restaurantId: reservation.restaurant?._id,
    }));

    console.log('Transformed Reservations sent to frontend:', transformedReservations);
    res.status(200).json(transformedReservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllReservations };
