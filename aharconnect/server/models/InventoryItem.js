const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'g', 'l', 'ml', 'pcs', 'box', 'pack']
    },
    threshold: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Raw Materials', 'Packaging', 'Utensils', 'Cleaning Supplies', 'Others']
    },
    supplier: {
        name: String,
        contact: String,
        email: String
    },
    costPerUnit: {
        type: Number,
        required: true,
        min: 0
    },
    lastPurchaseDate: Date,
    expiryDate: Date,
    location: {
        type: String,
        default: 'Main Storage'
    },
    notes: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add index for better search performance
inventoryItemSchema.index({ itemName: 'text' });

// Add method to check if item is low in stock
inventoryItemSchema.methods.isLowStock = function() {
    return this.quantity <= this.threshold;
};

// Add method to update quantity
inventoryItemSchema.methods.updateQuantity = async function(amount, operation = 'add') {
    if (operation === 'add') {
        this.quantity += amount;
    } else if (operation === 'subtract') {
        if (this.quantity < amount) {
            throw new Error('Insufficient quantity');
        }
        this.quantity -= amount;
    }
    this.lastUpdated = new Date();
    return this.save();
};

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

module.exports = InventoryItem; 