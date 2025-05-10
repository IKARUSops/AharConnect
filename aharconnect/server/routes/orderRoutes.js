const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes
router.use(authMiddleware);

// Create a new order
router.post('/', orderController.createOrder);

// Get user's orders
router.get('/user', orderController.getUserOrders);

// Get restaurant's orders
router.get('/restaurant/:restaurantId', orderController.getRestaurantOrders);

// Get a single order
router.get('/:orderId', orderController.getOrder);

// Update order status
router.patch('/:orderId/status', orderController.updateOrderStatus);

module.exports = router; 