import React, { useState } from 'react';
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import Button from '../../components/ui/button';
import { useCart } from '../../context/CartContext';
import Separator from '../../components/ui/separator';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../../components/ui/drawer.tsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { 
    items, 
    totalItems, 
    totalAmount,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    clearCart
  } = useCart();

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout');
    } else {
      toast.error('Your cart is empty');
    }
  };

  return (
    <>
      {/* Fixed Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-ahar-primary text-white p-4 rounded-full shadow-lg flex items-center justify-center"
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {totalItems}
          </span>
        )}
      </button>
      
      {/* Cart Drawer */}
      <Drawer open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>Your Cart</DrawerTitle>
            <DrawerDescription>
              {totalItems === 0 
                ? 'Your cart is empty' 
                : `You have ${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4 overflow-y-auto max-h-[50vh]">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Browse the menu to add delicious items to your cart
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.menuItem.id} className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.menuItem.name}</h4>
                      <p className="text-sm text-gray-500">${item.menuItem.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        size="icon" 
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </Button>
                      
                      <span className="w-6 text-center">{item.quantity}</span>
                      
                      <Button 
                        size="icon" 
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </Button>
                      
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeItem(item.menuItem.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    
                    <div className="text-right font-medium">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <>
              <Separator />
              
              <div className="p-4 space-y-4">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery Fee</span>
                  <span>$3.99</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tax</span>
                  <span>${(totalAmount * 0.08).toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(totalAmount + 3.99 + totalAmount * 0.08).toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
          
          <DrawerFooter className="flex-row gap-3">
            {items.length > 0 && (
              <Button variant="outline" className="flex-1" onClick={clearCart}>
                Clear Cart
              </Button>
            )}
            <Button 
              className="flex-1"
              disabled={items.length === 0}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
