const Restaurant = require('../models/restaurantModel');
const User = require('../models/User');

// Get all restaurants with optional filters
exports.getAll = async (filters = {}) => {
  try {
    return await Restaurant.find(filters);
  } catch (error) {
    throw new Error('Error fetching restaurants: ' + error.message);
  }
};

// Get restaurant by ID
exports.getById = async (id) => {
  try {
    return await Restaurant.findById(id);
  } catch (error) {
    throw new Error('Error fetching restaurant: ' + error.message);
  }
};

// Create new restaurant
exports.create = async (restaurantData) => {
  try {
    const restaurant = new Restaurant(restaurantData);
    return await restaurant.save();
  } catch (error) {
    throw new Error('Error creating restaurant: ' + error.message);
  }
};

// Update restaurant
exports.update = async (id, updateData) => {
  try {
    return await Restaurant.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  } catch (error) {
    throw new Error('Error updating restaurant: ' + error.message);
  }
};

// Delete restaurant
exports.delete = async (id) => {
  try {
    return await Restaurant.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Error deleting restaurant: ' + error.message);
  }
};

// Seed initial restaurant data if none exists
exports.seedInitialData = async () => {
  try {
    const count = await Restaurant.countDocuments();
    if (count === 0) {
      // Create a default admin user if not exists
      let adminUser = await User.findOne({ email: 'admin@example.com' });
      if (!adminUser) {
        adminUser = await User.create({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'admin123', // in production, this should be properly hashed
          role: 'admin'
        });
      }

      const sampleRestaurants = [
        {
          user: adminUser._id,
          name: 'The Italian Place',
          description: 'Authentic Italian cuisine in a cozy atmosphere',
          address: '123 Main St, New York, NY',
          phone: '(555) 123-4567',
          email: 'info@italianplace.com',
          openingHours: {
            opening: '11:00',
            closing: '22:00'
          },
          cuisine: ['Italian', 'Mediterranean'],
          capacity: 120,
          image: '/uploads/restaurants/italian-restaurant.jpg',
          rating: 4.5,
          priceRange: 'moderate',
          features: ['Outdoor Seating', 'Full Bar', 'Private Events']
        },
        {
          user: adminUser._id,
          name: 'Sakura Japanese',
          description: 'Traditional Japanese dining experience',
          address: '456 Elm St, New York, NY',
          phone: '(555) 234-5678',
          email: 'contact@sakura.com',
          openingHours: {
            opening: '12:00',
            closing: '23:00'
          },
          cuisine: ['Japanese', 'Sushi'],
          capacity: 80,
          image: '/uploads/restaurants/japanese-restaurant.jpg',
          rating: 4.7,
          priceRange: 'upscale',
          features: ['Sushi Bar', 'Private Rooms', 'Catering']
        },
        {
          user: adminUser._id,
          name: 'The Steakhouse',
          description: 'Premium cuts and fine dining experience',
          address: '789 Oak St, New York, NY',
          phone: '(555) 345-6789',
          email: 'reservations@steakhouse.com',
          openingHours: {
            opening: '16:00',
            closing: '23:00'
          },
          cuisine: ['Steakhouse', 'American'],
          capacity: 100,
          image: '/uploads/restaurants/steakhouse.jpg',
          rating: 4.8,
          priceRange: 'high-end',
          features: ['Wine Cellar', 'Private Events', 'Valet Parking']
        }
      ];

      await Restaurant.insertMany(sampleRestaurants);
      console.log('Sample restaurants seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding restaurants:', error);
    throw error;
  }
};