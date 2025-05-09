import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import Button from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Users } from 'lucide-react';

export const EventPackageCard = ({ eventPackage, isSelected = false, onSelect }) => {
  return (
    <Card 
      className={`transition-all duration-300 cursor-pointer hover:shadow-lg ${
        isSelected 
          ? 'border-[#6237A0] ring-2 ring-[#9754CB]/20' 
          : 'hover:border-[#9754CB]/50'
      }`}
      onClick={() => onSelect(eventPackage.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-[#28104E]">{eventPackage.name}</CardTitle>
          {isSelected && (
            <Badge className="bg-[#6237A0] text-white">Selected</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{eventPackage.description}</p>
        
        <div className="flex items-center text-sm mb-3 bg-[#F3EAFF] p-2 rounded-lg">
          <Users size={16} className="mr-1 text-[#6237A0]" />
          <span className="text-[#28104E]">Up to {eventPackage.maxCapacity} guests</span>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#28104E]">Includes:</p>
          <div className="flex flex-wrap gap-2">
            {eventPackage.amenities.map((amenity, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-[#F3EAFF] text-[#6237A0] border-[#9754CB]/20 hover:bg-[#DEACFS]/20"
              >
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-xl font-bold text-[#28104E]">
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
          className={`w-full ${
            isSelected 
              ? 'bg-[#6237A0] hover:bg-[#9754CB] text-white' 
              : 'border-[#6237A0] text-[#6237A0] hover:bg-[#F3EAFF]'
          }`}
        >
          {isSelected ? 'Selected' : 'Select Package'}
        </Button>
      </CardFooter>
    </Card>
  );
};
