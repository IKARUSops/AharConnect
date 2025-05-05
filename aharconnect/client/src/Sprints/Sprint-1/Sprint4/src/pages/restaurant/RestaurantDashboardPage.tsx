import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatCard } from '@/components/ui/stat-card';
import { mockOrders, mockMenuItems, mockReservations, mockInventoryItems } from '@/lib/mock-data';
import OrdersTable from '@/components/dashboard/OrdersTable';
import MenuItemsTable from '@/components/dashboard/MenuItemsTable';
import ReservationsTable from '@/components/dashboard/ReservationsTable';
import InventoryTable from '@/components/dashboard/InventoryTable';
import OrderAnalytics from '@/components/dashboard/OrderAnalytics';
import { Order, MenuItem, Reservation, InventoryItem } from '@/lib/types';

const analytics = {
    topSellingItems: [
    { itemName: 'Classic Burger', quantity: 45 },
    { itemName: 'Caesar Salad', quantity: 32 },
    { itemName: 'Cheesecake', quantity: 28 },
    { itemName: 'Iced Tea', quantity: 25 },
    { itemName: 'Garlic Bread', quantity: 22 },
    ],
    ordersByHour: [
      { hour: 11, count: 5 },
      { hour: 12, count: 15 },
      { hour: 13, count: 25 },
      { hour: 14, count: 15 },
      { hour: 15, count: 8 },
      { hour: 16, count: 5 },
      { hour: 17, count: 12 },
      { hour: 18, count: 30 },
      { hour: 19, count: 40 },
      { hour: 20, count: 35 },
      { hour: 21, count: 20 },
      { hour: 22, count: 10 },
    ],
    totalOrders: 220,
  totalRevenue: 4350.5,
    averageOrderValue: 19.75,
  };

const RestaurantDashboardPage = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems);

  // Orders handlers
  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
  };

  // Menu handlers
  const handleAddMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    const newId = `menu-${Date.now()}`;
    setMenuItems(prev => [...prev, { ...newItem, id: newId }]);
  };
  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Reservations handlers
  const handleReservationStatusChange = (reservationId: string, newStatus: Reservation['status']) => {
    setReservations(prev => prev.map(res => res.id === reservationId ? { ...res, status: newStatus } : res));
  };

  // Inventory handlers
  const handleInventoryRestock = (itemId: string, amount: number) => {
    setInventoryItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: item.quantity + amount } : item));
  };

  return (
    <Layout>
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="flex gap-2 bg-transparent p-0 mb-6">
          <TabsTrigger value="orders" className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors data-[state=active]:bg-[#B48CF2] data-[state=active]:text-white data-[state=active]:border-transparent bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]">Orders</TabsTrigger>
          <TabsTrigger value="menu" className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors data-[state=active]:bg-[#B48CF2] data-[state=active]:text-white data-[state=active]:border-transparent bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]">Menu</TabsTrigger>
          <TabsTrigger value="reservations" className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors data-[state=active]:bg-[#B48CF2] data-[state=active]:text-white data-[state=active]:border-transparent bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]">Reservations</TabsTrigger>
          <TabsTrigger value="inventory" className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors data-[state=active]:bg-[#B48CF2] data-[state=active]:text-white data-[state=active]:border-transparent bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]">Inventory</TabsTrigger>
          <TabsTrigger value="analytics" className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors data-[state=active]:bg-[#B48CF2] data-[state=active]:text-white data-[state=active]:border-transparent bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <div className="mb-4">
            <StatCard title="Order Count" value={orders.length} description="Total Orders" />
          </div>
          <OrdersTable orders={orders} onStatusChange={handleOrderStatusChange} />
          </TabsContent>
        <TabsContent value="menu">
          <MenuItemsTable menuItems={menuItems} inventoryItems={inventoryItems} onAddMenuItem={handleAddMenuItem} onUpdateMenuItem={handleUpdateMenuItem} onDeleteMenuItem={handleDeleteMenuItem} />
          </TabsContent>
          <TabsContent value="reservations">
          <ReservationsTable reservations={reservations} onStatusChange={handleReservationStatusChange} />
          </TabsContent>
          <TabsContent value="inventory">
          <InventoryTable inventoryItems={inventoryItems} onRestock={handleInventoryRestock} />
          </TabsContent>
          <TabsContent value="analytics">
            <OrderAnalytics analytics={analytics} />
          </TabsContent>
        </Tabs>
    </Layout>
  );
};

export default RestaurantDashboardPage;
