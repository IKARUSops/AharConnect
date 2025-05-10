import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setItems([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setItems(response.data.items || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to fetch cart');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (menuItem, quantity = 1, specialInstructions = '') => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(
        `${API_URL}/cart/items`,
        {
          menuItemId: menuItem._id,
          quantity,
          specialInstructions
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setItems(response.data.items);
      setError(null);
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setError('Failed to add item to cart');
      throw err;
    }
  };

  const removeItem = async (menuItemId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.delete(
        `${API_URL}/cart/items/${menuItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setItems(response.data.items);
      setError(null);
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError('Failed to remove item from cart');
      throw err;
    }
  };

  const updateQuantity = async (menuItemId, quantity) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put(
        `${API_URL}/cart/items/${menuItemId}`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setItems(response.data.items);
      setError(null);
    } catch (err) {
      console.error('Error updating item quantity:', err);
      setError('Failed to update item quantity');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated');
      }

      await axios.delete(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setItems([]);
      setError(null);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
      throw err;
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = () => {
    return items.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );
  };

  const value = {
    items,
    loading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalAmount,
    refreshCart: fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
