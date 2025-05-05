
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, MapPin } from 'lucide-react';

interface EventSpaceDetailsProps {
  eventSpace: {
    id: string;
    name: string;
    restaurantId: string;
    restaurantName: string;
    description: string;
    capacity: number;
    pricePerHour: number;
    minHours: number;
    availability: string;
    amenities: string[];
    images: string[];
    address: string;
  };
}

export const EventSpaceDetails: React.FC<EventSpaceDetailsProps> = ({ eventSpace }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? eventSpace.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === eventSpace.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-6">
      {/* Image Gallery */}
      <div className="relative h-96 rounded-lg overflow-hidden">
        <img 
          src={eventSpace.images[currentImageIndex]} 
          alt={`${eventSpace.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {eventSpace.images.length > 1 && (
          <>
            <Button 
              variant="outline" 
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={handlePrevImage}
            >
              ←
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={handleNextImage}
            >
              →
            </Button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <div className="bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                {currentImageIndex + 1} / {eventSpace.images.length}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Event Space Information */}
      <Tabs defaultValue="details">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Description</h3>
            <p className="text-gray-600 mt-1">{eventSpace.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="text-xl font-semibold flex justify-center items-center">
                    <Users size={18} className="mr-1" />
                    {eventSpace.capacity} people
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-xl font-semibold">
                    ${eventSpace.pricePerHour}/hour
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Minimum Hours</p>
                  <p className="text-xl font-semibold">
                    {eventSpace.minHours} hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Location</h3>
            <p className="text-gray-600 mt-1 flex items-center">
              <MapPin size={16} className="mr-1" />
              {eventSpace.address}
            </p>
            
            {/* Here you could add a small map with location pin */}
            <div className="mt-2 h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
              Map placeholder
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="amenities" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Available Amenities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              {eventSpace.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="policies" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Booking Policies</h3>
            <ul className="space-y-2 mt-2 text-gray-700">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></div>
                <span>Minimum booking time: {eventSpace.minHours} hours</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></div>
                <span>Cancellations must be made at least 48 hours before the event for a full refund</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></div>
                <span>A 50% deposit is required to secure the booking</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></div>
                <span>Additional cleaning fees may apply for certain types of events</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></div>
                <span>Outside food and beverages may not be permitted without prior approval</span>
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
