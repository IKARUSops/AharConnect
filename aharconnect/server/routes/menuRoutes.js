const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/menu')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

// Get all menu items (public)
router.get('/', async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        let query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search by name or description
        if (search) {
            query.$text = { $search: search };
        }

        // Build sort object
        let sortObj = {};
        if (sort) {
            const [field, order] = sort.split(':');
            sortObj[field] = order === 'desc' ? -1 : 1;
        } else {
            sortObj = { createdAt: -1 };
        }

        const menuItems = await MenuItem.find(query)
            .sort(sortObj)
            .populate('ingredients', 'itemName quantity unit');

        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single menu item (public)
router.get('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id)
            .populate('ingredients', 'itemName quantity unit');
        
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create menu item (admin only)
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
    try {
        const menuItemData = {
            ...req.body,
            imageURL: req.file ? `/uploads/menu/${req.file.filename}` : ''
        };

        const menuItem = new MenuItem(menuItemData);
        await menuItem.save();

        res.status(201).json(menuItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update menu item (admin only)
router.patch('/:id', adminAuth, upload.single('image'), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'price', 'category', 'isAvailable', 'ingredients', 'preparationTime', 'nutritionalInfo'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
    }

    try {
        const menuItem = await MenuItem.findById(req.params.id);
        
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        updates.forEach(update => menuItem[update] = req.body[update]);
        
        if (req.file) {
            menuItem.imageURL = `/uploads/menu/${req.file.filename}`;
        }

        await menuItem.save();
        res.json(menuItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete menu item (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update menu item availability (admin only)
router.patch('/:id/availability', adminAuth, async (req, res) => {
    try {
        const { isAvailable } = req.body;
        const menuItem = await MenuItem.findById(req.params.id);
        
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        menuItem.isAvailable = isAvailable;
        await menuItem.save();

        res.json(menuItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;