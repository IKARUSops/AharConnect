import React from 'react';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';

const CheckoutPage = () => {
  const { items, totalItems } = useCart();
  return (
    <Layout>
      <div className="ahar-container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Checkout</h1>
          <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
              {Array.isArray(items) && items.length > 0 ? (
                items.map(item => (
                  <div key={item.menuItem?.id || Math.random()} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.quantity} x </span>
                      {item.menuItem?.name || 'Unknown'}
                    </div>
                    <div className="font-medium">${item.menuItem?.price ? (item.menuItem.price * item.quantity).toFixed(2) : '0.00'}</div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Your cart is empty.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
