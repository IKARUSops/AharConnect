const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected and require authentication
router.use(authMiddleware);

// Get user's cart
router.get('/', cartController.getCart);

// Add item to cart
router.post('/items', cartController.addToCart);

// Remove item from cart
router.delete('/items/:menuItemId', cartController.removeFromCart);

// Update item quantity
router.put('/items/:menuItemId', cartController.updateQuantity);

// Clear cart
router.delete('/', cartController.clearCart);

module.exports = router; 