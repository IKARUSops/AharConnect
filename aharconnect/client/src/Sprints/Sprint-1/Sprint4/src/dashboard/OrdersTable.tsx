import React from 'react';
import { Order } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OrdersTableProps {
  orders: Order[];
  onStatusChange?: (orderId: string, newStatus: Order['status']) => void;
}

function formatDateTime(dateString: string) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
}

export default function OrdersTable({ orders, onStatusChange }: OrdersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order.id}>
              <TableCell>{order.id || 'N/A'}</TableCell>
              <TableCell>{formatDateTime(order.createdAt)}</TableCell>
              <TableCell>{Array.isArray(order.items) ? order.items.map(item => item?.menuItem?.name || 'Unknown').join(', ') : 'No items'}</TableCell>
              <TableCell>{typeof order.totalAmount === 'number' ? `$${order.totalAmount.toFixed(2)}` : 'N/A'}</TableCell>
              <TableCell>{order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'N/A'}</TableCell>
              <TableCell>
                <button className="px-2 py-1 bg-gray-200 rounded">View</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
