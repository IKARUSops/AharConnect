const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with authentication
router.use(authMiddleware);

// Send a new message
router.post('/', messageController.sendMessage);

// Get conversation history for an event space
router.get('/event-space/:eventSpaceId', messageController.getConversation);

// Mark messages as read
router.post('/mark-read', messageController.markAsRead);

// Get unread message count
router.get('/unread-count', messageController.getUnreadCount);

// Get all conversations for a restaurant
router.get('/restaurant-conversations', messageController.getRestaurantConversations);

module.exports = router; 