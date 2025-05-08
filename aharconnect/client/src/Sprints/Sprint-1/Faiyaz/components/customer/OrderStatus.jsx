
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

type OrderStatusType = 'pending' | 'preparing' | 'ready' | 'delivered';

interface OrderStatusProps {
  orderId: string;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ orderId }) => {
  const [status, setStatus] = useState<OrderStatusType>('pending');
  const [estimatedTime, setEstimatedTime] = useState<number>(30);

  // Mock the real-time status updates
  useEffect(() => {
    const statusSequence: OrderStatusType[] = ['pending', 'preparing', 'ready', 'delivered'];
    let currentIndex = 0;
    
    const statusInterval = setInterval(() => {
      if (currentIndex < statusSequence.length - 1) {
        currentIndex++;
        const newStatus = statusSequence[currentIndex];
        setStatus(newStatus);
        
        // Update estimated time
        if (newStatus === 'preparing') {
          setEstimatedTime(20);
          toast.success('Your order is being prepared!');
        } else if (newStatus === 'ready') {
          setEstimatedTime(10);
          toast.success('Your order is ready for delivery!');
        } else if (newStatus === 'delivered') {
          setEstimatedTime(0);
          toast.success('Your order has been delivered!');
          clearInterval(statusInterval);
        }
      } else {
        clearInterval(statusInterval);
      }
    }, 8000);
    
    return () => clearInterval(statusInterval);
  }, [orderId]);

  const statusMessages = {
    pending: 'Your order has been received and is waiting to be prepared.',
    preparing: 'Our chefs are preparing your delicious meal!',
    ready: 'Your order is ready and out for delivery.',
    delivered: 'Your order has been delivered. Enjoy your meal!',
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Order Status</h3>
      
      <div className="relative">
        <div className="overflow-hidden h-2 text-xs flex bg-gray-200 rounded">
          <div
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
              status === 'pending' ? 'bg-yellow-500 w-1/4' :
              status === 'preparing' ? 'bg-blue-500 w-2/4' :
              status === 'ready' ? 'bg-orange-500 w-3/4' : 'bg-green-500 w-full'
            } transition-all duration-500`}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span className={status === 'pending' ? 'font-bold text-yellow-600' : ''}>Received</span>
          <span className={status === 'preparing' ? 'font-bold text-blue-600' : ''}>Preparing</span>
          <span className={status === 'ready' ? 'font-bold text-orange-600' : ''}>On the way</span>
          <span className={status === 'delivered' ? 'font-bold text-green-600' : ''}>Delivered</span>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-700">{statusMessages[status]}</p>
        
        {status !== 'delivered' && (
          <p className="text-gray-600 mt-2">
            Estimated delivery in <span className="font-medium">{estimatedTime}</span> minutes
          </p>
        )}
      </div>
    </div>
  );
};
