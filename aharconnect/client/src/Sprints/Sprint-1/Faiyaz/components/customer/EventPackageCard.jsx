import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import Button from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Users } from 'lucide-react';

export const EventPackageCard = ({ 
  eventPackage, 
  isSelected = false, 
  onSelect 
}) => {
  return (
    <Card 
      className={`transition-all cursor-pointer ${
        isSelected 
          ? 'border-purple-400 ring-2 ring-purple-200' 
          : 'hover:border-purple-200'
      }`}
      onClick={() => onSelect(eventPackage.id)}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{eventPackage.name}</CardTitle>
          {isSelected && <Badge>Selected</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{eventPackage.description}</p>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Users size={16} className="mr-1" />
          <span>Up to {eventPackage.maxCapacity} guests</span>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Includes:</p>
          <div className="flex flex-wrap gap-1">
            {eventPackage.amenities.map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-xl font-bold">
          ${eventPackage.price.toFixed(2)}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(eventPackage.id);
          }}
          variant={isSelected ? "default" : "outline"}
          className="w-full"
        >
          {isSelected ? 'Selected' : 'Select Package'}
        </Button>
      </CardFooter>
    </Card>
  );
};
