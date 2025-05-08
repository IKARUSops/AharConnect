// server/controllers/restaurantController.js

const restaurantService = require('../services/mongoRestaurantService');
const Restaurant = require('../models/restaurantModel');
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
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant profile not found' });
    }
    res.json(restaurant);
  } catch (error) {
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

    let restaurant = await Restaurant.findOne({ user: req.user._id });

    if (restaurant) {
      // Update existing profile
      restaurant = await Restaurant.findOneAndUpdate(
        { user: req.user._id },
        {
          name,
          description,
          address,
          phone,
          email,
          openingHours,
          cuisine,
          capacity,
          image
        },
        { new: true }
      );
    } else {
      // Create new profile
      restaurant = new Restaurant({
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
      await restaurant.save();
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Profile update error:', error);
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

    restaurant.image = req.file.path;
    await restaurant.save();

    res.json({ image: restaurant.image });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Upload restaurant photo
exports.uploadPhoto = async (req, res) => {
  try {
    upload(req, res, async function(err) {
      if (err) {
        return res.status(400).json({ message: err });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const restaurantId = req.user.restaurantId; // Assuming you have user info in req.user
      const photoUrl = `/uploads/restaurants/${req.file.filename}`;

      const restaurant = await Restaurant.findByIdAndUpdate(
        restaurantId,
        { image: photoUrl },
        { new: true }
      );

      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      res.json({ 
        message: 'Photo uploaded successfully',
        photoUrl: photoUrl
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
