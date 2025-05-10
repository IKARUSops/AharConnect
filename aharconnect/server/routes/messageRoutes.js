const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with authentication
router.use(authMiddleware);

// Send a new message
router.post('/', messageController.sendMessage);

// Get conversation history for an event space
router.get('/event-space/:eventSpaceId', (req, res, next) => {
  req.params.messageType = 'event';
  next();
}, messageController.getConversation);

// Get conversation history for a menu item
router.get('/menu-item/:menuItemId', (req, res, next) => {
  req.params.messageType = 'menu';
  next();
}, messageController.getConversation);

// Get messages by sender ID
router.get('/sender/:senderId', messageController.getMessagesBySender);

// Mark messages as read
router.post('/mark-read', messageController.markAsRead);

// Get unread message count
router.get('/unread-count', messageController.getUnreadCount);

// Get all conversations for a restaurant
router.get('/restaurant-conversations', messageController.getRestaurantConversations);

// Get all conversations for a user (Foodie)
router.get('/user-conversations', messageController.getUserConversations);

module.exports = router; 