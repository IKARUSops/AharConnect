import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, addDays } from 'date-fns';
import { Users, Clock, Calendar, MessageCircle } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { EventPackage } from '@/lib/types';
import { EventPackageCard } from '@/components/customer/EventPackageCard';
import { EventBookingConfirmation } from '@/components/customer/EventBookingConfirmation';
import { EventSpaceDetails } from '@/components/customer/EventSpaceDetails';

// Mock event spaces data (copied from EventSpacesPage)
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

// Mock event packages
const mockEventPackages: EventPackage[] = [
  {
    id: '1',
    name: 'Basic Event Package',
    description: 'Standard setup with basic decorations and service.',
    price: 1200,
    maxCapacity: 100,
    amenities: ['Basic Decoration', 'Standard Tables & Chairs', 'Basic Sound System'],
    restaurantId: '1',
  },
  {
    id: '2',
    name: 'Premium Celebration',
    description: 'Enhanced decorations, premium food options, and dedicated staff.',
    price: 2500,
    maxCapacity: 150,
    amenities: ['Premium Decorations', 'Upgraded Tables & Chairs', 'Advanced Sound System', 'Lighting Setup', 'Dedicated Staff'],
    restaurantId: '1',
  },
  {
    id: '3',
    name: 'Deluxe Wedding Package',
    description: 'Our complete wedding package with everything you need for the perfect day.',
    price: 5000,
    maxCapacity: 200,
    amenities: ['Elegant Decorations', 'Premium Tables & Settings', 'Professional Sound System', 'Advanced Lighting', 'Dedicated Wedding Coordinator', 'Welcome Drinks', 'Custom Menu Options'],
    restaurantId: '1',
  }
];

// Mock time slots
const mockTimeSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM', 
  '1:00 PM', '2:00 PM', '3:00 PM', 
  '4:00 PM', '5:00 PM', '6:00 PM', 
  '7:00 PM', '8:00 PM'
];

const EventBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');
  const [partySize, setPartySize] = useState<number>(50);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Fetch event space details
  const { data: eventSpace = mockEventSpaces[0] } = useQuery({
    queryKey: ['eventSpace', id],
    queryFn: async () => {
      // Find the event space by id
      return mockEventSpaces.find(space => space.id === id) || mockEventSpaces[0];
    }
  });

  // Fetch event packages
  const { data: eventPackages = mockEventPackages } = useQuery({
    queryKey: ['eventPackages', eventSpace.restaurantId],
    queryFn: async () => {
      // In a real app, this would be an API call
      return mockEventPackages;
    }
  });

  const selectedPackage = eventPackages.find(pkg => pkg.id === selectedPackageId);
  
  const isDateAvailable = (date: Date) => {
    // Mock availability logic - in a real app this would check against bookings database
    // For demo purposes, let's make some dates unavailable
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dateString = format(date, 'yyyy-MM-dd');
    
    const unavailableDates = ['2025-05-01', '2025-05-15', '2025-05-20'];
    return !unavailableDates.includes(dateString) && !isWeekend;
  };

  const handleContinueToPackages = () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      toast.error('Please select a date and time for your event');
      return;
    }
    
    setCurrentStep(2);
  };

  const handleContinueToDetails = () => {
    if (!selectedPackageId) {
      toast.error('Please select an event package');
      return;
    }
    
    setCurrentStep(3);
  };

  const handleBookEvent = () => {
    // Validation
    if (!customerName || !customerEmail || !customerPhone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would make an API call to create the booking
    // For demo purposes, we'll just show success and "send" a confirmation
    
    // Generate a booking reference
    const bookingId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setBookingRef(bookingId);
    
    // Show success message and update state
    toast.success('Your event has been booked successfully!');
    setBookingComplete(true);
    
    // In a real app, this would trigger an email/SMS to the customer
  };

  const handleContactRestaurant = () => {
    toast.success('Message sent to restaurant. They will contact you shortly.');
  };

  // If booking is complete, show confirmation
  if (bookingComplete) {
    return (
      <Layout>
        <div className="ahar-container py-12">
          <EventBookingConfirmation 
            bookingRef={bookingRef}
            eventSpace={eventSpace}
            eventPackage={selectedPackage!}
            date={selectedDate!}
            startTime={selectedStartTime}
            endTime={selectedEndTime}
            customerName={customerName}
            customerEmail={customerEmail}
            customerPhone={customerPhone}
            specialRequests={specialRequests}
            partySize={partySize}
            onContactRestaurant={handleContactRestaurant}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="ahar-container py-12">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          ← Back to Event Spaces
        </Button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{eventSpace.name}</h1>
          <p className="text-gray-600">{eventSpace.restaurantName} - {eventSpace.address}</p>
        </div>
        
        <div className="max-w-2xl mx-auto flex flex-col items-center">
            <EventSpaceDetails eventSpace={eventSpace} />
          <div className="mt-8 w-full">
            <Card>
              <CardHeader>
                <CardTitle>Book This Event Space</CardTitle>
                <div className="flex space-x-2 mt-2">
                  <Badge variant={currentStep === 1 ? "default" : "outline"}>1. Date & Time</Badge>
                  <Badge variant={currentStep === 2 ? "default" : "outline"}>2. Package</Badge>
                  <Badge variant={currentStep === 3 ? "default" : "outline"}>3. Details</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label>Select a date</Label>
                      <div className="border rounded-md mt-1 w-full">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today || !isDateAvailable(date);
                          }}
                          initialFocus
                          className="rounded-md w-full compact-calendar"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Select 
                          value={selectedStartTime} 
                          onValueChange={setSelectedStartTime}
                        >
                          <SelectTrigger id="startTime">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockTimeSlots.slice(0, -1).map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Select 
                          value={selectedEndTime} 
                          onValueChange={setSelectedEndTime} 
                          disabled={!selectedStartTime}
                        >
                          <SelectTrigger id="endTime">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockTimeSlots
                              .filter(time => {
                                if (!selectedStartTime) return true;
                                const startIndex = mockTimeSlots.indexOf(selectedStartTime);
                                const timeIndex = mockTimeSlots.indexOf(time);
                                return timeIndex > startIndex && 
                                      timeIndex - startIndex >= eventSpace.minHours;
                              })
                              .map(time => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="partySize">Party Size</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          id="partySize"
                          type="number"
                          value={partySize}
                          onChange={(e) => setPartySize(Number(e.target.value))}
                          min={1}
                          max={eventSpace.capacity}
                        />
                        <span className="text-sm text-gray-600">Max: {eventSpace.capacity}</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleContinueToPackages} 
                      className="w-full"
                      disabled={!selectedDate || !selectedStartTime || !selectedEndTime}
                    >
                      Continue to Packages
                    </Button>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Selected Date & Time</p>
                        <p className="text-sm text-gray-600">
                          {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                          {selectedStartTime && selectedEndTime && `, ${selectedStartTime} - ${selectedEndTime}`}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setCurrentStep(1)}
                      >
                        Edit
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-base">Select an Event Package</Label>
                      <div className="space-y-4 mt-3">
                        {eventPackages.map(pkg => (
                          <div 
                            key={pkg.id} 
                            className={`border rounded-md p-4 cursor-pointer transition-all ${
                              selectedPackageId === pkg.id 
                                ? 'border-primary ring-2 ring-primary/20' 
                                : 'hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedPackageId(pkg.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{pkg.name}</h3>
                                <p className="text-sm text-gray-600">{pkg.description}</p>
                              </div>
                              <p className="font-bold">${pkg.price.toFixed(2)}</p>
                            </div>
                            
                            <div className="mt-2">
                              <div className="flex items-center text-sm text-gray-600 mb-1">
                                <Users size={14} className="mr-1" />
                                <span>Up to {pkg.maxCapacity} guests</span>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mt-2">
                                {pkg.amenities.map((amenity, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleContinueToDetails} 
                      className="w-full"
                      disabled={!selectedPackageId}
                    >
                      Continue to Details
                    </Button>
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Selected Package</p>
                        <p className="text-sm text-gray-600">
                          {selectedPackage?.name} - ${selectedPackage?.price.toFixed(2)}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setCurrentStep(2)}
                      >
                        Edit
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="customerName">Your Name</Label>
                        <Input
                          id="customerName"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Full Name"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="customerEmail">Email</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="customerPhone">Phone Number</Label>
                        <Input
                          id="customerPhone"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="(123) 456-7890"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="specialRequests">Special Requests</Label>
                        <Textarea
                          id="specialRequests"
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          placeholder="Any special requirements or requests for your event..."
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleBookEvent} 
                      className="w-full"
                      disabled={!customerName || !customerEmail || !customerPhone}
                    >
                      Complete Booking
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col items-start">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Need to discuss something specific?</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full flex items-center"
                    onClick={() => navigate(`/events/message/${eventSpace.id}`)}
                  >
                    <MessageCircle size={14} className="mr-1" /> Message Restaurant Directly
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventBookingPage;
