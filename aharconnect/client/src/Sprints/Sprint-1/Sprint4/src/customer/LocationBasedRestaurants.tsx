
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/lib/types';
import { mockRestaurants } from '@/lib/mock-data';

interface LocationBasedRestaurantsProps {
  onLocationChange: (location: string) => void;
}

export const LocationBasedRestaurants: React.FC<LocationBasedRestaurantsProps> = ({
  onLocationChange
}) => {
  const [location, setLocation] = useState<string>('New York');
  const [isLocating, setIsLocating] = useState(false);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);

  // Simulate getting restaurants based on location
  useEffect(() => {
    // This would be an API call in a real application
    const filteredRestaurants = mockRestaurants.slice(0, 3); // Just take first 3 for demo
    setNearbyRestaurants(filteredRestaurants);
  }, [location]);

  const handleGetLocation = () => {
    setIsLocating(true);
    
    // Use browser's geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would use these coordinates to get the address
          // For this demo, we'll just set a fixed location
          const locationName = "Your Current Location";
          setLocation(locationName);
          onLocationChange(locationName);
          toast.success('Location updated successfully');
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not access your location');
          setIsLocating(false);
        },
        { timeout: 10000 }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setIsLocating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-ahar-primary mr-2" />
          <h3 className="font-medium text-lg">Delivering to: {location}</h3>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleGetLocation}
          disabled={isLocating}
        >
          {isLocating ? 'Locating...' : 'Use My Location'}
        </Button>
      </div>

      {nearbyRestaurants.length > 0 && (
        <div className="text-sm text-gray-600">
          {nearbyRestaurants.length} restaurants deliver to your location
        </div>
      )}
    </div>
  );
};
