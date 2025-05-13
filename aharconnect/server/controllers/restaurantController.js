// server/controllers/restaurantController.js

const restaurantService = require('../services/mongoRestaurantService');
const Restaurant = require('../models/restaurantModel');
const Item = require('../models/itemModel');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/restaurants')
  },
  filename: function (req, file, cb) {
    cb(null, 'restaurant-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('restaurantImage');

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

exports.getRestaurants = async (req, res) => {
  try {
    const filters = req.query;
    const restaurants = await restaurantService.getAll(filters);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await restaurantService.getById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const newRestaurant = await restaurantService.create(req.body);
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const updatedRestaurant = await restaurantService.update(req.params.id, req.body);
    if (!updatedRestaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const deletedRestaurant = await restaurantService.delete(req.params.id);
    if (!deletedRestaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get restaurant profile
exports.getProfile = async (req, res) => {
  try {
    console.log('[RestaurantController] Getting profile for user:', {
      userId: req.user._id,
      userType: req.user.type,
      headers: req.headers
    });

    const restaurant = await Restaurant.findByUserId(req.user._id);
    console.log('[RestaurantController] Restaurant lookup result:', {
      found: !!restaurant,
      restaurantId: restaurant?._id,
      restaurantName: restaurant?.name
    });

    if (!restaurant) {
      console.log('[RestaurantController] No restaurant profile found for user:', req.user._id);
      return res.status(404).json({ error: 'Restaurant profile not found' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('[RestaurantController] Error fetching restaurant profile:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id
    });
    res.status(500).json({ error: 'Server error' });
  }
};

// Create or update restaurant profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      phone,
      email,
      openingHours,
      cuisine,
      capacity,
      image
    } = req.body;

    let restaurant = await Restaurant.findByUserId(req.user._id);

    if (restaurant) {
      // Update existing profile
      restaurant = await Restaurant.updateRestaurant(req.user._id, {
        name,
        description,
        address,
        phone,
        email,
        openingHours,
        cuisine,
        capacity,
        image
      });
    } else {
      // Create new profile
      restaurant = await Restaurant.createRestaurant({
        user: req.user._id,
        name,
        description,
        address,
        phone,
        email,
        openingHours,
        cuisine,
        capacity,
        image
      });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('[RestaurantController] Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Upload restaurant image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant profile not found' });
    }

    const photoUrl = `/uploads/restaurants/${req.file.filename}`;
    restaurant.image = photoUrl;
    await restaurant.save();

    res.json({ image: photoUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Upload restaurant photo
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const photoUrl = `/uploads/restaurants/${req.file.filename}`;
    restaurant.image = photoUrl;
    await restaurant.save();

    res.json({ 
      message: 'Photo uploaded successfully',
      photoUrl: photoUrl
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get menu items for a specific restaurant
exports.getMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menuItems = await Item.find({ restaurant: restaurantId });
    res.status(200).json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get restaurant by user
exports.getRestaurantByUser = async (req, res) => {
  try {
    const user = req.params.user;
    const restaurant = await Restaurant.findOne({ user });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
