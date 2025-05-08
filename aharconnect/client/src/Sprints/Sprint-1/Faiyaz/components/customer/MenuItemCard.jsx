import React from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Button from '../../components/ui/button';
import { MenuItem } from '../../lib/types';
import { useCart } from '../../context/CartContext';

interface MenuItemCardProps {
  menuItem: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ menuItem }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(menuItem);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {menuItem.image && (
        <div className="h-40 overflow-hidden">
          <img
            src={menuItem.image}
            alt={menuItem.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{menuItem.name}</h3>
          <div className="text-base font-semibold">${menuItem.price.toFixed(2)}</div>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{menuItem.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <Badge variant="outline" className="capitalize text-xs bg-gray-50">
            {menuItem.category}
          </Badge>
          <div className="text-gray-500 text-xs">{menuItem.preparationTime} mins</div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          disabled={!menuItem.available}
          className="w-full"
          variant={menuItem.available ? "default" : "outline"}
        >
          {menuItem.available ? 'Add to Cart' : 'Unavailable'}
        </Button>
      </div>
    </Card>
  );
};
