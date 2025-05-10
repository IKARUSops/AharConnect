const Order = require('../models/Order');
const Item = require('../models/itemModel');
const Restaurant = require('../models/restaurantModel');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;
    const userId = req.user._id;

    console.log('[OrderController] Creating order:', {
      userId,
      itemsCount: items?.length,
      deliveryAddress
    });

    if (!items || !items.length) {
      console.error('[OrderController] No items in order');
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Calculate total amount and get restaurant ID from first item
    const firstMenuItem = await Item.findById(items[0].menuItem);
    if (!firstMenuItem) {
      console.error('[OrderController] First menu item not found:', items[0].menuItem);
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const restaurantId = firstMenuItem.restaurant_id;
    console.log('[OrderController] Restaurant ID from first item:', restaurantId);

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await Item.findById(item.menuItem);
      if (!menuItem) {
        console.error('[OrderController] Menu item not found:', item.menuItem);
        return res.status(404).json({ error: `Menu item ${item.menuItem} not found` });
      }
      totalAmount += menuItem.price * item.quantity;
    }

    console.log('[OrderController] Calculated total amount:', totalAmount);

    const order = new Order({
      userId,
      restaurantId,
      items: items.map(item => ({
        ...item,
        price: firstMenuItem.price
      })),
      totalAmount,
      deliveryAddress,
      status: 'pending'
    });

    await order.save();
    console.log('[OrderController] Order saved successfully:', order._id);

    // Populate the response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.menuItem')
      .populate('userId')
      .populate('restaurantId');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('[OrderController] Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
};

// Get orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.menuItem')
      .populate('restaurantId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

// Get orders for a restaurant
exports.getRestaurantOrders = async (req, res) => {
  try {
    console.log('[OrderController] Fetching orders for restaurant:', {
      restaurantId: req.params.restaurantId,
      userId: req.user._id,
      headers: req.headers
    });
    
    // First check if the restaurant exists and belongs to the user
    const restaurant = await Restaurant.findOne({ 
      _id: req.params.restaurantId,
      user: req.user._id 
    });

    if (!restaurant) {
      console.error('[OrderController] Restaurant not found or does not belong to user:', {
        restaurantId: req.params.restaurantId,
        userId: req.user._id
      });
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    console.log('[OrderController] Found restaurant:', {
      restaurantId: restaurant.user,
      name: restaurant.name
    });
    
    const orders = await Order.find({ restaurantId: restaurant.user })
      .populate('items.menuItem')
      .populate('userId')
      .sort({ createdAt: -1 });

    console.log('[OrderController] Found orders:', {
      count: orders.length,
      restaurantId: req.params.restaurantId,
      orders: orders.map(order => ({
        id: order._id,
        status: order.status,
        totalAmount: order.totalAmount,
        itemCount: order.items.length
      }))
    });

    res.json(orders);
  } catch (error) {
    console.error('[OrderController] Error fetching restaurant orders:', {
      error: error.message,
      stack: error.stack,
      restaurantId: req.params.restaurantId
    });
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
};

// Get a single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('items.menuItem')
      .populate('restaurantId')
      .populate('userId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
}; 