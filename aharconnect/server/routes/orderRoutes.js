const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const InventoryItem = require('../models/InventoryItem');
const { auth, adminAuth } = require('../middleware/auth');

// Get all orders (admin only)
router.get('/admin', adminAuth, async (req, res) => {
    try {
        const { status, startDate, endDate, sort } = req.query;
        let query = {};

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Filter by date range
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Build sort object
        let sortObj = {};
        if (sort) {
            const [field, order] = sort.split(':');
            sortObj[field] = order === 'desc' ? -1 : 1;
        } else {
            sortObj = { createdAt: -1 };
        }

        const orders = await Order.find(query)
            .sort(sortObj)
            .populate('customerId', 'name email phone')
            .populate('items.menuItemId');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('items.menuItemId');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customerId', 'name email phone')
            .populate('items.menuItemId');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if user is authorized to view this order
        if (req.user.role !== 'admin' && order.customerId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new order
router.post('/', auth, async (req, res) => {
    try {
        const { items, paymentMethod, deliveryAddress, isDelivery } = req.body;

        // Calculate total amount and validate items
        let totalAmount = 0;
        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItemId);
            if (!menuItem) {
                return res.status(400).json({ error: `Menu item ${item.menuItemId} not found` });
            }
            if (!menuItem.isAvailable) {
                return res.status(400).json({ error: `Menu item ${menuItem.name} is not available` });
            }
            totalAmount += menuItem.price * item.quantity;
        }

        const order = new Order({
            customerId: req.user._id,
            items,
            totalAmount,
            paymentMethod,
            deliveryAddress,
            isDelivery
        });

        await order.save();

        // Emit order created event
        req.app.get('io').emit('orderCreated', order);

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update order status (admin only)
router.patch('/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.status = status;
        await order.save();

        // Emit order status update event
        req.app.get('io').emit('orderStatusUpdated', {
            orderId: order._id,
            status: order.status
        });

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Cancel order
router.patch('/:id/cancel', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if user is authorized to cancel this order
        if (req.user.role !== 'admin' && order.customerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to cancel this order' });
        }

        // Check if order can be cancelled
        if (!['Pending', 'Confirmed'].includes(order.status)) {
            return res.status(400).json({ error: 'Order cannot be cancelled in its current status' });
        }

        order.status = 'Cancelled';
        await order.save();

        // Emit order cancelled event
        req.app.get('io').emit('orderCancelled', {
            orderId: order._id,
            status: order.status
        });

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get order analytics (admin only)
router.get('/analytics/summary', adminAuth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const totalOrders = await Order.countDocuments(query);
        const totalRevenue = await Order.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const ordersByStatus = await Order.aggregate([
            { $match: query },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const topSellingItems = await Order.aggregate([
            { $match: query },
            { $unwind: '$items' },
            { $group: { 
                _id: '$items.menuItemId',
                totalQuantity: { $sum: '$items.quantity' }
            }},
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
            { $lookup: {
                from: 'menuitems',
                localField: '_id',
                foreignField: '_id',
                as: 'menuItem'
            }},
            { $unwind: '$menuItem' }
        ]);

        res.json({
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            ordersByStatus,
            topSellingItems
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;