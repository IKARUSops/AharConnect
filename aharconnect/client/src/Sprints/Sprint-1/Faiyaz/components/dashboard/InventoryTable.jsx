
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryItem } from '../../lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface InventoryTableProps {
  inventoryItems: InventoryItem[];
  onRestock?: (itemId: string, amount: number) => void;
}

export default function InventoryTable({ inventoryItems, onRestock }: InventoryTableProps) {
  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= 0) {
      return { status: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    } else if (item.quantity <= item.threshold) {
      return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'In Stock', color: 'bg-green-100 text-green-800' };
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Last Restocked</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                No inventory items found
              </TableCell>
            </TableRow>
          ) : (
            inventoryItems.map((item) => {
              const { status, color } = getStockStatus(item);
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <Badge className={color} variant="outline">
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell>${item.cost.toFixed(2)}</TableCell>
                  <TableCell>{item.lastRestocked ?? 'N/A'}</TableCell>
                  <TableCell>
                    {onRestock ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRestock(item.id, 10)}
                      >
                        Restock
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
