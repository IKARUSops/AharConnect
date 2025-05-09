import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import Button from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Users, MapPin } from 'lucide-react';

export const EventSpaceDetails = ({ eventSpace }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? eventSpace.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === eventSpace.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
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

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-[#28104E] mb-2">Description</h3>
            <p className="text-gray-600">{eventSpace.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="transform transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Capacity</p>
                  <p className="text-xl font-semibold flex justify-center items-center text-[#28104E]">
                    <Users size={18} className="mr-1 text-[#9754CB]" />
                    {eventSpace.capacity} people
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="transform transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-xl font-semibold text-[#28104E]">
                    ${eventSpace.pricePerHour}/hour
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="transform transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Minimum Hours</p>
                  <p className="text-xl font-semibold text-[#28104E]">
                    {eventSpace.minHours} hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-[#28104E] mb-2">Location</h3>
            <p className="text-gray-600 flex items-center">
              <MapPin size={16} className="mr-1 text-[#9754CB]" />
              {eventSpace.address}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="amenities" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-[#28104E] mb-3">Available Amenities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {eventSpace.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center bg-[#F3EAFF] p-3 rounded-lg">
                  <div className="w-2 h-2 bg-[#6237A0] rounded-full mr-2"></div>
                  <span className="text-[#28104E]">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="policies" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-[#28104E] mb-3">Booking Policies</h3>
            <ul className="space-y-3">
              <li className="flex items-start bg-[#F3EAFF] p-3 rounded-lg">
                <div className="w-2 h-2 bg-[#6237A0] rounded-full mr-2 mt-2"></div>
                <span className="text-[#28104E]">Minimum booking time: {eventSpace.minHours} hours</span>
              </li>
              <li className="flex items-start bg-[#F3EAFF] p-3 rounded-lg">
                <div className="w-2 h-2 bg-[#6237A0] rounded-full mr-2 mt-2"></div>
                <span className="text-[#28104E]">Cancellations must be made at least 48 hours before the event for a full refund</span>
              </li>
              <li className="flex items-start bg-[#F3EAFF] p-3 rounded-lg">
                <div className="w-2 h-2 bg-[#6237A0] rounded-full mr-2 mt-2"></div>
                <span className="text-[#28104E]">A 50% deposit is required to secure the booking</span>
              </li>
              <li className="flex items-start bg-[#F3EAFF] p-3 rounded-lg">
                <div className="w-2 h-2 bg-[#6237A0] rounded-full mr-2 mt-2"></div>
                <span className="text-[#28104E]">Additional cleaning fees may apply for certain types of events</span>
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
