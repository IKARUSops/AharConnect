
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, OrderItem } from '@/lib/types';
import { toast } from 'sonner';

interface CartContextProps {
  items: OrderItem[];
  addItem: (menuItem: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  restaurantId: string;
}

export const CartProvider = ({ children, restaurantId }: CartProviderProps) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${restaurantId}`);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, [restaurantId]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(`cart-${restaurantId}`, JSON.stringify(items));
    } else {
      localStorage.removeItem(`cart-${restaurantId}`);
    }
  }, [items, restaurantId]);

  const addItem = (menuItem: MenuItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.menuItem.id === menuItem.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.menuItem.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { menuItem, quantity: 1 }];
      }
    });
    toast.success(`${menuItem.name} added to cart`);
    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.menuItem.id === itemId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(`cart-${restaurantId}`);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.menuItem.price * item.quantity), 
    0
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
    isCartOpen,
    setIsCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
