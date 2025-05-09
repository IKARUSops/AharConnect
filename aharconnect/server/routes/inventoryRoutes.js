const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { auth, adminAuth } = require('../middleware/auth');

// Get inventory analytics (admin only)
router.get('/analytics/summary', adminAuth, inventoryController.getAnalytics);

// Get all inventory items (admin only)
router.get('/', adminAuth, inventoryController.getAllItems);

// Create inventory item (admin only)
router.post('/', adminAuth, inventoryController.createItem);

// Get single inventory item (admin only)
router.get('/:id', adminAuth, inventoryController.getItemById);

// Update inventory item (admin only)
router.put('/:id', adminAuth, inventoryController.updateItem);

// Update inventory quantity (admin only)
router.patch('/:id/quantity', adminAuth, inventoryController.updateItemQuantity);

// Delete inventory item (admin only)
router.delete('/:id', adminAuth, inventoryController.deleteItem);

module.exports = router;

module.exports = router;
