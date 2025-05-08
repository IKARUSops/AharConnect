import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Users, CalendarCheck, Filter } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import Separator from '../../components/ui/separator';
import { Badge } from '../../components/ui/badge';
import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import AppTheme from '../../../../../shared-theme/AppTheme';
import { CssBaseline, Stack } from '@mui/material';

// Mock event spaces data
const mockEventSpaces = [
  {
    id: '1',
    name: 'Grand Hall',
    restaurantId: '1',
    restaurantName: 'The Italian Place',
    description: 'A spacious hall perfect for large gatherings, weddings, and corporate events.',
    capacity: 200,
    pricePerHour: 350,
    minHours: 4,
    availability: 'Available',
    amenities: ['Tables & Chairs', 'Sound System', 'Projector', 'Wi-Fi', 'Air Conditioning'],
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2370&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=2370&auto=format&fit=crop',
    ],
    address: '123 Main St, New York, NY',
  },
  {
    id: '2',
    name: 'Garden Terrace',
    restaurantId: '2',
    restaurantName: 'Sakura Japanese',
    description: 'A beautiful outdoor space surrounded by lush gardens, perfect for intimate gatherings.',
    capacity: 80,
    pricePerHour: 250,
    minHours: 3,
    availability: 'Available',
    amenities: ['Tables & Chairs', 'Outdoor Heaters', 'String Lights', 'Tent Option'],
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2370&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=2370&auto=format&fit=crop',
    ],
    address: '456 Elm St, New York, NY',
  },
  {
    id: '3',
    name: 'VIP Lounge',
    restaurantId: '3',
    restaurantName: 'The Steakhouse',
    description: 'An exclusive lounge with premium amenities for sophisticated events and gatherings.',
    capacity: 50,
    pricePerHour: 300,
    minHours: 2,
    availability: 'Booked',
    amenities: ['Premium Bar', 'Private Restrooms', 'DJ Booth', 'Security'],
    images: [
      'https://images.unsplash.com/photo-1517659649778-bae24b8c2e26?q=80&w=2369&auto=format&fit=crop',
    ],
    address: '789 Oak St, New York, NY',
  },
  {
    id: '4',
    name: 'Rooftop Venue',
    restaurantId: '1',
    restaurantName: 'The Italian Place',
    description: 'Stunning rooftop venue with panoramic city views, perfect for special celebrations.',
    capacity: 120,
    pricePerHour: 400,
    minHours: 3,
    availability: 'Available',
    amenities: ['Full Bar', 'Lounge Seating', 'Dance Floor', 'Catering Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1561912774-79769a0a0a7a?q=80&w=2260&auto=format&fit=crop',
    ],
    address: '123 Main St, New York, NY',
  },
];

const EventSpacesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState(null);
  const [location, setLocation] = useState('New York');
  const [partySize, setPartySize] = useState(0);

  const handlePartySizeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setPartySize(isNaN(value) ? 0 : value);
  };

  const { data: eventSpaces = mockEventSpaces } = useQuery({
    queryKey: ['eventSpaces'],
    queryFn: async () => {
      // In a real app, this would be an API call
      return mockEventSpaces;
    }
  });

  // Filter event spaces based on search term and capacity
  const filteredEventSpaces = eventSpaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCapacity = capacityFilter === null || space.capacity >= capacityFilter;
    
    return matchesSearch && matchesCapacity;
  });

  const handleCapacityChange = (capacity) => {
    setCapacityFilter(capacity);
  };

  return (
    <AppTheme>
      <CssBaseline />
      <Layout>
        <Stack direction="column" spacing={2}>
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 py-12">
            <div className="ahar-container">
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <h1 className="text-4xl font-bold">Find the Perfect Event Space</h1>
              </Stack>
              
              <div className="mb-8">
                <p className="text-lg mb-4">Looking for a venue for your next special occasion? Browse our collection of event spaces available for booking.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2 relative">
                  <Input
                    type="text"
                    placeholder="Search by venue name, features or restaurant..."
                    className="px-4 py-3 h-12 text-base"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Button size="icon" variant="ghost">
                      <Filter size={16} />
                    </Button>
                  </div>
                </div>
                <div className="col-span-1">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Search
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => setCapacityFilter(null)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${capacityFilter === null ? 'bg-[#B48CF2] text-white border-transparent' : 'bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]'}`}
                >
                  All Sizes
                </button>
                <button
                  onClick={() => setCapacityFilter(50)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${capacityFilter === 50 ? 'bg-[#B48CF2] text-white border-transparent' : 'bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]'}`}
                >
                  50+ People
                </button>
                <button
                  onClick={() => setCapacityFilter(100)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${capacityFilter === 100 ? 'bg-[#B48CF2] text-white border-transparent' : 'bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]'}`}
                >
                  100+ People
                </button>
                <button
                  onClick={() => setCapacityFilter(150)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${capacityFilter === 150 ? 'bg-[#B48CF2] text-white border-transparent' : 'bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]'}`}
                >
                  150+ People
                </button>
                <button
                  onClick={() => setCapacityFilter(200)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${capacityFilter === 200 ? 'bg-[#B48CF2] text-white border-transparent' : 'bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]'}`}
                >
                  200+ People
                </button>
                <button
                  onClick={() => setCapacityFilter(250)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${capacityFilter === 250 ? 'bg-[#B48CF2] text-white border-transparent' : 'bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]'}`}
                >
                  250+ People
                </button>
                <button
                  onClick={() => setCapacityFilter(300)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${capacityFilter === 300 ? 'bg-[#B48CF2] text-white border-transparent' : 'bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]'}`}
                >
                  300+ People
                </button>
              </div>
            </div>
          </div>

          <div className="ahar-container py-12">
            <Stack spacing={3}>
              <h2 className="text-2xl font-semibold">
                {filteredEventSpaces.length} Event Spaces Found in {location}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredEventSpaces.map(space => (
                  <Card key={space.id} className="overflow-hidden">
                    <div className="h-64 overflow-hidden relative">
                      <img
                        src={space.images[0]}
                        alt={space.name}
                        className="w-full h-full object-cover"
                      />
                      {space.availability === 'Booked' && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">Currently Booked</span>
                        </div>
                      )}
                    </div>

                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{space.name}</CardTitle>
                          <p className="text-gray-600">{space.restaurantName}</p>
                        </div>
                        <Badge variant={space.availability === 'Available' ? 'default' : 'outline'} className="text-xs">
                          {space.availability}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-gray-600 line-clamp-2">{space.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users size={16} className="mr-1" />
                          <span>Up to {space.capacity} people</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-1" />
                          <span>{space.address}</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="font-medium text-sm mb-2">Amenities:</p>
                        <div className="flex flex-wrap gap-2">
                          {space.amenities.slice(0, 3).map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {space.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{space.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-baseline justify-between">
                        <div className="text-xl font-semibold">
                          ${space.pricePerHour.toFixed(2)} <span className="text-sm font-normal">/ hour</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Min. {space.minHours} hours
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => toast.info(`View more photos of ${space.name}`)}>
                        More Photos
                      </Button>
                      <Button 
                        asChild
                        disabled={space.availability === 'Booked'}
                      >
                        <Link to={`/events/book/${space.id}`}>
                          Book This Space
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredEventSpaces.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-600">No event spaces found</h3>
                  <p className="mt-2 text-gray-500">Try adjusting your filters or search term.</p>
                </div>
              )}
            </Stack>
          </div>
        </Stack>
      </Layout>
    </AppTheme>
  );
};

export default EventSpacesPage;
