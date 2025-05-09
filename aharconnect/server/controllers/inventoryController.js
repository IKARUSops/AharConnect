const InventoryItem = require('../models/InventoryItem');
const MenuItem = require('../models/MenuItem');
const Item = require('../models/itemModel');

/**
 * This controller handles inventory management with support for two different models:
 * 1. InventoryItem - Advanced inventory tracking with quantities, thresholds, etc.
 * 2. Item - Basic item management from the git branch
 * 
 * IMPORTANT: You should configure which model is active via the environment variable
 * or modify the code to use appropriate model based on your requirements.
 */

// Determine which model to use - replace with your configuration approach
// For example: const MODEL_TYPE = process.env.INVENTORY_MODEL || 'INVENTORY_ITEM';
const MODEL_TYPE = 'INVENTORY_ITEM'; // Options: 'INVENTORY_ITEM' or 'ITEM'

// Get all inventory items
exports.getAllItems = async (req, res) => {
    try {
        if (MODEL_TYPE === 'INVENTORY_ITEM') {
            const { category, search, sort, lowStock } = req.query;
            let query = {};

            // Filter by category
            if (category) {
                query.category = category;
            }

            // Search by name
            if (search) {
                query.$text = { $search: search };
            }

            // Filter low stock items
            if (lowStock === 'true') {
                query.$expr = { $lte: ['$quantity', '$threshold'] };
            }

            // Build sort object
            let sortObj = {};
            if (sort) {
                const [field, order] = sort.split(':');
                sortObj[field] = order === 'desc' ? -1 : 1;
            } else {
                sortObj = { itemName: 1 };
            }

            const inventoryItems = await InventoryItem.find(query).sort(sortObj);
            res.json(inventoryItems);
        } else {
            // Use Item model instead
            const items = await Item.find();
            res.status(200).json(items);
        }
    } catch (error) {
        console.error('Error getting all items:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

// Get single inventory item
exports.getItemById = async (req, res) => {
    try {
        let item;
        
        if (MODEL_TYPE === 'INVENTORY_ITEM') {
            item = await InventoryItem.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ error: 'Inventory item not found' });
            }
        } else {
            item = await Item.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            }
        }

        res.json(item);
    } catch (error) {
        console.error('Error getting item by ID:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

// Create inventory item
exports.createItem = async (req, res) => {
    try {
        let savedItem;

        if (MODEL_TYPE === 'INVENTORY_ITEM') {
            const inventoryItem = new InventoryItem(req.body);
            savedItem = await inventoryItem.save();

            // Check if this affects any menu items
            await updateMenuAvailability(savedItem);
        } else {
            const { item_name, category, price, description, image, item_status } = req.body;
            const item = new Item({ 
                item_name, 
                category, 
                price, 
                description, 
                image, 
                item_status 
            });
            savedItem = await item.save();
        }

        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(400).json({ error: error.message || 'Internal server error' });
    }
};

// Update inventory item
exports.updateItem = async (req, res) => {
    try {
        if (MODEL_TYPE === 'INVENTORY_ITEM') {
            const updates = Object.keys(req.body);
            const allowedUpdates = ['itemName', 'quantity', 'unit', 'threshold', 'category', 'supplier', 'costPerUnit', 'location', 'notes'];
            const isValidOperation = updates.every(update => allowedUpdates.includes(update));

            if (!isValidOperation) {
                return res.status(400).json({ error: 'Invalid updates' });
            }

            const inventoryItem = await InventoryItem.findById(req.params.id);
            
            if (!inventoryItem) {
                return res.status(404).json({ error: 'Inventory item not found' });
            }

            updates.forEach(update => inventoryItem[update] = req.body[update]);
            await inventoryItem.save();

            // Check if this affects any menu items
            await updateMenuAvailability(inventoryItem);

            res.json(inventoryItem);
        } else {
            const { item_name, category, price, description, image, item_status } = req.body;
            const updatedItem = await Item.findByIdAndUpdate(
                req.params.id,
                { item_name, category, price, description, image, item_status },
                { new: true }
            );
            
            if (!updatedItem) {
                return res.status(404).json({ error: 'Item not found' });
            }
            
            res.status(200).json(updatedItem);
        }
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(400).json({ error: error.message || 'Internal server error' });
    }
};

// Delete inventory item
exports.deleteItem = async (req, res) => {
    try {
        if (MODEL_TYPE === 'INVENTORY_ITEM') {
            const inventoryItem = await InventoryItem.findByIdAndDelete(req.params.id);
            
            if (!inventoryItem) {
                return res.status(404).json({ error: 'Inventory item not found' });
            }

            // Check if this affects any menu items
            await updateMenuAvailability(inventoryItem);

            res.json({ message: 'Inventory item deleted successfully' });
        } else {
            const deletedItem = await Item.findByIdAndDelete(req.params.id);
            
            if (!deletedItem) {
                return res.status(404).json({ error: 'Item not found' });
            }
            
            res.status(204).send();
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

// Update inventory quantity - only for InventoryItem model
exports.updateItemQuantity = async (req, res) => {
    if (MODEL_TYPE !== 'INVENTORY_ITEM') {
        return res.status(404).json({ error: 'Method not available for current model' });
    }

    try {
        const { amount, operation } = req.body;
        const inventoryItem = await InventoryItem.findById(req.params.id);
        
        if (!inventoryItem) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        await inventoryItem.updateQuantity(amount, operation);

        // Check if this affects any menu items
        await updateMenuAvailability(inventoryItem);

        res.json(inventoryItem);
    } catch (error) {
        console.error('Error updating item quantity:', error);
        res.status(400).json({ error: error.message || 'Internal server error' });
    }
};

// Get inventory analytics - only for InventoryItem model
exports.getAnalytics = async (req, res) => {
    if (MODEL_TYPE !== 'INVENTORY_ITEM') {
        return res.status(404).json({ error: 'Method not available for current model' });
    }

    try {
        const lowStockItems = await InventoryItem.find({
            $expr: { $lte: ['$quantity', '$threshold'] }
        });

        const totalItems = await InventoryItem.countDocuments();
        const totalValue = await InventoryItem.aggregate([
            { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$costPerUnit'] } } } }
        ]);

        const itemsByCategory = await InventoryItem.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.json({
            lowStockItems,
            totalItems,
            totalValue: totalValue[0]?.total || 0,
            itemsByCategory
        });
    } catch (error) {
        console.error('Error getting analytics:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

// Helper function to update menu item availability based on inventory
async function updateMenuAvailability(inventoryItem) {
    if (!inventoryItem || MODEL_TYPE !== 'INVENTORY_ITEM') return;
    
    try {
        const menuItems = await MenuItem.find({ ingredients: inventoryItem._id });
        
        for (const menuItem of menuItems) {
            const allIngredientsAvailable = await Promise.all(
                menuItem.ingredients.map(async (ingredientId) => {
                    const ingredient = await InventoryItem.findById(ingredientId);
                    return ingredient && ingredient.quantity > 0;
                })
            );

            menuItem.isAvailable = allIngredientsAvailable.every(available => available);
            await menuItem.save();
        }
    } catch (error) {
        console.error('Error updating menu availability:', error);
    }
}
