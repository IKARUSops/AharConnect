const mongoose = require('mongoose');
const { Schema } = mongoose; 

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;