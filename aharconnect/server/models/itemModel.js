const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  item_name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String, required: false },
  item_status: { type: String, default: 'available' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

itemSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Item', itemSchema);