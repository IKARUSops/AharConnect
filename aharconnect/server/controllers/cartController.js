const Cart = require('../models/Cart');
const Item = require('../models/itemModel');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    console.log('[CartController] Getting cart for user:', req.user._id);
    
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.menuItem')
      .populate('restaurantId');

    if (!cart) {
      console.log('[CartController] No cart found, creating new cart');
      return res.json({ items: [], totalItems: 0, totalAmount: 0 });
    }

    console.log('[CartController] Cart found:', {
      itemCount: cart.items.length,
      restaurantId: cart.restaurantId
    });

    res.json(cart);
  } catch (error) {
    console.error('[CartController] Error getting cart:', error);
    res.status(500).json({ error: 'Error fetching cart' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity = 1, specialInstructions = '' } = req.body;
    console.log('[CartController] Adding item to cart:', {
      userId: req.user._id,
      menuItemId,
      quantity,
      specialInstructions
    });

    // Get menu item to check restaurant
    const menuItem = await Item.findById(menuItemId);
    if (!menuItem) {
      console.error('[CartController] Menu item not found:', menuItemId);
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      console.log('[CartController] Creating new cart');
      cart = new Cart({
        userId: req.user._id,
        restaurantId: menuItem.restaurant_id,
        items: []
      });
    } else if (cart.restaurantId.toString() !== menuItem.restaurant_id.toString()) {
      console.log('[CartController] Different restaurant, clearing cart');
      cart.items = [];
      cart.restaurantId = menuItem.restaurant_id;
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.menuItem.toString() === menuItemId
    );

    if (existingItemIndex > -1) {
      console.log('[CartController] Updating existing item quantity');
      cart.items[existingItemIndex].quantity += quantity;
      if (specialInstructions) {
        cart.items[existingItemIndex].specialInstructions = specialInstructions;
      }
    } else {
      console.log('[CartController] Adding new item to cart');
      cart.items.push({
        menuItem: menuItemId,
        quantity,
        specialInstructions
      });
    }

    await cart.save();
    console.log('[CartController] Cart saved successfully');

    // Return updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.menuItem')
      .populate('restaurantId');

    res.json(updatedCart);
  } catch (error) {
    console.error('[CartController] Error adding to cart:', error);
    res.status(500).json({ error: 'Error adding item to cart' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    console.log('[CartController] Removing item from cart:', {
      userId: req.user._id,
      menuItemId
    });

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      console.log('[CartController] No cart found');
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.menuItem.toString() !== menuItemId
    );

    await cart.save();
    console.log('[CartController] Item removed from cart');

    // Return updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.menuItem')
      .populate('restaurantId');

    res.json(updatedCart);
  } catch (error) {
    console.error('[CartController] Error removing from cart:', error);
    res.status(500).json({ error: 'Error removing item from cart' });
  }
};

// Update item quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const { quantity } = req.body;
    console.log('[CartController] Updating item quantity:', {
      userId: req.user._id,
      menuItemId,
      quantity
    });

    if (quantity < 1) {
      return this.removeFromCart(req, res);
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      console.log('[CartController] No cart found');
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.menuItem.toString() === menuItemId
    );

    if (itemIndex === -1) {
      console.log('[CartController] Item not found in cart');
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    console.log('[CartController] Quantity updated');

    // Return updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.menuItem')
      .populate('restaurantId');

    res.json(updatedCart);
  } catch (error) {
    console.error('[CartController] Error updating quantity:', error);
    res.status(500).json({ error: 'Error updating item quantity' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    console.log('[CartController] Clearing cart for user:', req.user._id);
    
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      console.log('[CartController] No cart found');
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    console.log('[CartController] Cart cleared');

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('[CartController] Error clearing cart:', error);
    res.status(500).json({ error: 'Error clearing cart' });
  }
}; 