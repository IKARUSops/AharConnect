const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventSpaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventSpace'
  },
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  },
  messageType: {
    type: String,
    enum: ['event', 'menu'],
    required: true,
    default: 'event'
  },
  subject: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  senderType: {
    type: String,
    enum: ['customer', 'restaurant'],
    required: true
  },
  senderName: {
    type: String,
    required: function() {
      return this.senderType === 'customer';
    }
  },
  senderEmail: {
    type: String,
    required: function() {
      return this.senderType === 'customer';
    }
  },
  senderPhone: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ eventSpaceId: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 