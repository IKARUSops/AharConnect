const Message = require('../models/Message');
const User = require('../models/User');
const Restaurant = require('../models/restaurantModel');
const EventSpace = require('../models/EventSpace');
const mongoose = require('mongoose');

// Send a new message
exports.sendMessage = async (req, res) => {
  console.log('[MessageController] Starting sendMessage operation');
  console.log('[MessageController] Request body:', {
    eventSpaceId: req.body.eventSpaceId,
    subject: req.body.subject,
    receiverId: req.body.receiverId,
    senderId: req.user._id,
    senderName: req.body.senderName,
    senderEmail: req.body.senderEmail
  });

  try {
    const { eventSpaceId, content, subject, receiverId, senderName, senderEmail, senderPhone } = req.body;
    const senderId = req.user._id;

    // Validate required fields
    if (!eventSpaceId || !content || !subject || !receiverId) {
      console.error('[MessageController] Missing required fields:', {
        hasEventSpaceId: !!eventSpaceId,
        hasContent: !!content,
        hasSubject: !!subject,
        hasReceiverId: !!receiverId
      });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Determine sender type
    console.log('[MessageController] Finding restaurant for sender:', senderId);
    const restaurant = await Restaurant.findOne({ user: senderId });
    const senderType = restaurant ? 'restaurant' : 'customer';
    console.log('[MessageController] Determined sender type:', senderType);

    const message = new Message({
      senderId,
      receiverId,
      eventSpaceId,
      subject,
      content,
      senderType,
      senderName: senderName || undefined,
      senderEmail: senderEmail || undefined,
      senderPhone: senderPhone || undefined
    });

    console.log('[MessageController] Created new message object:', {
      messageId: message._id,
      eventSpaceId,
      senderType,
      subject,
      senderName
    });

    await message.save();
    console.log('[MessageController] Message saved successfully');

    // Populate sender and receiver details
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .populate('eventSpaceId', 'name');

    console.log('[MessageController] Message populated with details:', {
      messageId: populatedMessage._id,
      sender: populatedMessage.senderId?.name,
      receiver: populatedMessage.receiverId?.name,
      eventSpace: populatedMessage.eventSpaceId?.name
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('[MessageController] Error in sendMessage:', {
      error: error.message,
      stack: error.stack,
      userId: req.user._id,
      eventSpaceId: req.body.eventSpaceId
    });
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get conversation history for an event space
exports.getConversation = async (req, res) => {
  console.log('[MessageController] Starting getConversation operation');
  console.log('[MessageController] Request params:', {
    eventSpaceId: req.params.eventSpaceId,
    userId: req.user._id
  });

  try {
    const { eventSpaceId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      eventSpaceId,
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    })
    .populate('senderId', 'name email')
    .populate('receiverId', 'name email')
    .sort({ createdAt: 1 });

    console.log('[MessageController] Retrieved conversation:', {
      eventSpaceId,
      messageCount: messages.length,
      firstMessageDate: messages[0]?.createdAt,
      lastMessageDate: messages[messages.length - 1]?.createdAt
    });

    res.json(messages);
  } catch (error) {
    console.error('[MessageController] Error in getConversation:', {
      error: error.message,
      stack: error.stack,
      eventSpaceId: req.params.eventSpaceId,
      userId: req.user._id
    });
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  console.log('[MessageController] Starting markAsRead operation');
  console.log('[MessageController] Request body:', {
    messageIds: req.body.messageIds,
    userId: req.user._id
  });

  try {
    const { messageIds } = req.body;
    const userId = req.user._id;

    const result = await Message.updateMany(
      {
        _id: { $in: messageIds },
        receiverId: userId,
        isRead: false
      },
      { isRead: true }
    );

    console.log('[MessageController] Messages marked as read:', {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      messageIds
    });

    res.json({ 
      message: 'Messages marked as read',
      updated: result.modifiedCount
    });
  } catch (error) {
    console.error('[MessageController] Error in markAsRead:', {
      error: error.message,
      stack: error.stack,
      messageIds: req.body.messageIds,
      userId: req.user._id
    });
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  console.log('[MessageController] Starting getUnreadCount operation');
  console.log('[MessageController] User ID:', req.user._id);

  try {
    const userId = req.user._id;

    const count = await Message.countDocuments({
      receiverId: userId,
      isRead: false
    });

    console.log('[MessageController] Unread message count:', {
      userId,
      count
    });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('[MessageController] Error in getUnreadCount:', {
      error: error.message,
      stack: error.stack,
      userId: req.user._id
    });
    res.status(500).json({ error: 'Failed to get unread message count' });
  }
};

// Get all conversations for a restaurant
exports.getRestaurantConversations = async (req, res) => {
  console.log('[MessageController] Starting getRestaurantConversations operation');
  console.log('[MessageController] User ID:', req.user?._id);
  
  try {
    if (!req.user || !req.user._id) {
      console.error('[MessageController] No user ID in request');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get the restaurant document using the user ID
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    console.log('[MessageController] Restaurant lookup result:', {
      userId: req.user._id,
      found: !!restaurant,
      restaurantId: restaurant?._id,
      restaurantName: restaurant?.name
    });
    
    if (!restaurant) {
      console.warn('[MessageController] No restaurant found for user:', req.user._id);
      return res.status(404).json({ error: 'Restaurant not found. Please complete your restaurant profile first.' });
    }

    // First, get raw messages to check their state
    const rawMessages = await Message.find({
      receiverId: restaurant._id
    });

    console.log('[MessageController] Raw messages found:', rawMessages.map(msg => ({
      _id: msg._id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      subject: msg.subject,
      isRead: msg.isRead,
      content: msg.content,
      senderType: msg.senderType
    })));

    // Get all messages where receiverId is the restaurant's ID
    console.log('[MessageController] Querying messages with population');

    const messages = await Message.find({
      receiverId: restaurant._id
    })
    .populate('senderId', 'name email')
    .sort({ createdAt: -1 })
    .lean();

    console.log('[MessageController] Messages after population:', messages.map(msg => ({
      _id: msg._id,
      senderId: msg.senderId?._id,
      senderName: msg.senderId?.name,
      receiverId: msg.receiverId,
      subject: msg.subject,
      content: msg.content,
      senderType: msg.senderType
    })));

    // Group messages by sender (customer)
    const conversationMap = new Map();
    let skippedMessages = 0;
    
    messages.forEach(message => {
      try {
        const senderId = message.senderId?._id?.toString();
        
        if (!senderId) {
          console.warn('[MessageController] Skipping message - invalid sender:', {
            messageId: message._id,
            senderId: message.senderId,
            content: message.content
          });
          skippedMessages++;
          return;
        }

        if (!conversationMap.has(senderId)) {
          conversationMap.set(senderId, {
            customerId: senderId,
            customerName: message.senderId?.name || 'Unknown Customer',
            customerEmail: message.senderId?.email || 'No email',
            lastMessageDate: message.createdAt,
            unreadCount: 0,
            messages: []
          });
        }

        const conversation = conversationMap.get(senderId);
        conversation.messages.push({
          _id: message._id,
          content: message.content,
          subject: message.subject,
          senderId: senderId,
          senderName: message.senderId?.name,
          senderType: message.senderType,
          receiverId: message.receiverId,
          createdAt: message.createdAt,
          isRead: message.isRead
        });
        
        if (message.createdAt > conversation.lastMessageDate) {
          conversation.lastMessageDate = message.createdAt;
        }
        
        if (!message.isRead) {
          conversation.unreadCount++;
        }
      } catch (err) {
        console.error('[MessageController] Error processing message:', {
          messageId: message?._id,
          error: err.message,
          stack: err.stack,
          message: message
        });
        skippedMessages++;
      }
    });

    // Convert map to array and sort by last message date
    const conversations = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate))
      .map(conv => ({
        ...conv,
        messages: conv.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }));

    console.log('[MessageController] Final result:', {
      totalMessages: messages.length,
      skippedMessages,
      conversationsCreated: conversations.length,
      conversations: conversations.map(c => ({
        customerId: c.customerId,
        customerName: c.customerName,
        messageCount: c.messages.length,
        unreadCount: c.unreadCount,
        lastMessageDate: c.lastMessageDate,
        lastMessage: c.messages[0]?.content,
        firstMessage: c.messages[c.messages.length - 1]?.content
      }))
    });

    res.json(conversations);
  } catch (error) {
    console.error('[MessageController] Fatal error in getRestaurantConversations:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
      restaurantId: restaurant?._id,
      details: {
        name: error.name,
        code: error.code,
        keyPattern: error.keyPattern,
        keyValue: error.keyValue
      }
    });
    res.status(500).json({ 
      error: 'Failed to fetch conversations',
      details: error.message 
    });
  }
}; 