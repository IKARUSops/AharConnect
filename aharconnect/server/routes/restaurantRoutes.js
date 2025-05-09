const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getMenuItems } = require('../controllers/restaurantController');

// Profile routes
router.get('/profile', authMiddleware, restaurantController.getProfile);
router.put('/profile', authMiddleware, restaurantController.updateProfile);
router.post('/upload-photo', authMiddleware, upload.single('image'), restaurantController.uploadPhoto);

// CRUD routes
router.get('/', restaurantController.getRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.post('/', authMiddleware, restaurantController.createRestaurant);
router.put('/:id', authMiddleware, restaurantController.updateRestaurant);
router.delete('/:id', authMiddleware, restaurantController.deleteRestaurant);

// Menu routes
router.get('/:restaurantId/menu', getMenuItems);

// User route
router.get('/user/:user', restaurantController.getRestaurantByUser);

module.exports = router;