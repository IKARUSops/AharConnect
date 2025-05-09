const Restaurant = require('../models/restaurantModel');

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