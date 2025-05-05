
import React, { useState } from 'react';
import { format } from 'date-fns';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReservationsTable from '@/components/dashboard/ReservationsTable';
import ReservationCalendar from '@/components/dashboard/ReservationCalendar';
import EventPackagesTable from '@/components/dashboard/EventPackagesTable';
import { StatCard } from '@/components/ui/stat-card';
import { Reservation, EventPackage, EventBooking } from '@/lib/types';
import { toast } from '@/components/ui/sonner';

// Mock data for reservations and event packages
const mockEventPackages: EventPackage[] = [
  {
    id: 'pkg1',
    name: 'Birthday Party Package',
    description: 'Celebrate your special day with a complete party package including decorations, cake, and special menu.',
    price: 299.99,
    maxCapacity: 15,
    amenities: ['Decorations', 'Cake', 'Special Menu', 'Reserved Area'],
    restaurantId: '1',
  },
  {
    id: 'pkg2',
    name: 'Corporate Meeting',
    description: 'Professional setting with presentation equipment and business lunch options for your team meetings.',
    price: 199.99,
    maxCapacity: 20,
    amenities: ['Projector', 'Whiteboard', 'Business Lunch', 'Coffee Service'],
    restaurantId: '1',
  },
  {
    id: 'pkg3',
    name: 'Wedding Reception',
    description: 'Elegant venue for your wedding reception with customizable menu, decorations, and seating arrangements.',
    price: 1999.99,
    maxCapacity: 50,
    amenities: ['Custom Menu', 'Decorations', 'Wedding Cake', 'Private Bar'],
    restaurantId: '1',
  }
];

const mockEventBookings: EventBooking[] = [
  {
    id: 'eb1',
    restaurantId: '1',
    customerId: 'cust1',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    customerPhone: '555-123-4567',
    eventPackageId: 'pkg1',
    date: '2023-05-15',
    startTime: '18:00',
    endTime: '21:00',
    partySize: 12,
    status: 'confirmed',
    totalAmount: 299.99,
    specialRequests: 'Blue and white color theme for decorations',
  },
  {
    id: 'eb2',
    restaurantId: '1',
    customerId: 'cust2',
    customerName: 'Tech Solutions Inc.',
    customerEmail: 'events@techsolutions.com',
    customerPhone: '555-987-6543',
    eventPackageId: 'pkg2',
    date: '2023-05-20',
    startTime: '13:00',
    endTime: '17:00',
    partySize: 15,
    status: 'pending',
    totalAmount: 199.99,
    specialRequests: 'Need HDMI connection for laptop presentation',
  }
];

// Import mockReservations but add customer information
const mockEnhancedReservations: Reservation[] = [
  {
    id: 'res1',
    restaurantId: '1',
    customerId: 'cust1',
    customerName: 'Maria Garcia',
    customerEmail: 'maria@example.com',
    customerPhone: '555-111-2222',
    date: '2023-05-10',
    time: '19:00',
    partySize: 4,
    status: 'confirmed',
    tableNumber: 8,
  },
  {
    id: 'res2',
    restaurantId: '1',
    customerId: 'cust4',
    customerName: 'Raj Patel',
    customerEmail: 'raj@example.com',
    customerPhone: '555-333-4444',
    date: '2023-05-15',
    time: '20:30',
    partySize: 2,
    status: 'pending',
    specialRequests: 'Window seat if possible',
  },
  {
    id: 'res3',
    restaurantId: '1',
    customerId: 'cust2',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    customerPhone: '555-555-6666',
    date: '2023-05-20',
    time: '18:00',
    partySize: 6,
    status: 'confirmed',
    tableNumber: 12,
    specialRequests: 'Birthday celebration, please prepare a surprise',
  },
];

const ReservationsManagementPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>(mockEnhancedReservations);
  const [eventPackages, setEventPackages] = useState<EventPackage[]>(mockEventPackages);
  const [eventBookings, setEventBookings] = useState<EventBooking[]>(mockEventBookings);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Handle reservation status change
  const handleReservationStatusChange = (reservationId: string, newStatus: Reservation['status']) => {
    setReservations(prevReservations =>
      prevReservations.map(reservation =>
        reservation.id === reservationId ? { ...reservation, status: newStatus } : reservation
      )
    );
    
    // Show confirmation notification
    if (newStatus === 'confirmed') {
      // In a real app, this would trigger an email/SMS notification
      toast.success(`Reservation confirmed! Notification sent to customer.`);
    } else if (newStatus === 'canceled') {
      toast.info(`Reservation canceled. Customer has been notified.`);
    }
  };
  
  // Handle event booking status change
  const handleEventBookingStatusChange = (bookingId: string, newStatus: EventBooking['status']) => {
    setEventBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
    
    // Show confirmation notification
    if (newStatus === 'confirmed') {
      toast.success(`Event booking confirmed! Notification sent to customer.`);
    } else if (newStatus === 'canceled') {
      toast.info(`Event booking canceled. Customer has been notified.`);
    }
  };
  
  // Handle adding a new event package
  const handleAddEventPackage = (newPackage: Omit<EventPackage, 'id'>) => {
    const packageWithId = {
      ...newPackage,
      id: `pkg-${Date.now()}`
    };
    
    setEventPackages(prevPackages => [...prevPackages, packageWithId]);
  };
  
  // Handle updating an event package
  const handleUpdateEventPackage = (updatedPackage: EventPackage) => {
    setEventPackages(prevPackages =>
      prevPackages.map(pkg =>
        pkg.id === updatedPackage.id ? updatedPackage : pkg
      )
    );
  };
  
  // Handle deleting an event package
  const handleDeleteEventPackage = (packageId: string) => {
    setEventPackages(prevPackages =>
      prevPackages.filter(pkg => pkg.id !== packageId)
    );
  };
  
  // Handle date selection in calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Get reservations for today
  const todayReservations = reservations.filter(reservation => 
    reservation.date === format(new Date(), 'yyyy-MM-dd')
  ).length;
  
  // Get pending reservations
  const pendingReservations = reservations.filter(reservation => 
    reservation.status === 'pending'
  ).length;
  
  // Get upcoming events
  const upcomingEvents = eventBookings.filter(booking => 
    new Date(booking.date) >= new Date() && booking.status !== 'canceled'
  ).length;
  
  // Calculate total revenue from event bookings
  const eventRevenue = eventBookings
    .filter(booking => booking.status === 'confirmed')
    .reduce((total, booking) => total + booking.totalAmount, 0);

  return (
    <Layout>
      <div className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reservations Management</h1>
            <p className="text-gray-500">Manage your restaurant reservations and event bookings</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Today's Reservations" 
            value={todayReservations}
            description="Bookings for today"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
            }
          />
          <StatCard 
            title="Pending Requests" 
            value={pendingReservations}
            description="Need your attention"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            }
          />
          <StatCard 
            title="Upcoming Events" 
            value={upcomingEvents}
            description="Scheduled events"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              </svg>
            }
          />
          <StatCard 
            title="Event Revenue" 
            value={`$${eventRevenue.toFixed(2)}`}
            description="From confirmed events"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            }
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="calendar" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="reservations">Table Reservations</TabsTrigger>
            <TabsTrigger value="events">Event Packages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-2">
            <ReservationCalendar 
              reservations={reservations}
              eventBookings={eventBookings}
              onDateSelect={handleDateSelect}
            />
          </TabsContent>
          
          <TabsContent value="reservations" className="mt-2">
            <h2 className="text-xl font-semibold mb-4">Table Reservations</h2>
            <ReservationsTable 
              reservations={reservations}
              onStatusChange={handleReservationStatusChange}
            />
          </TabsContent>
          
          <TabsContent value="events" className="mt-2">
            <h2 className="text-xl font-semibold mb-4">Event Management</h2>
            <EventPackagesTable 
              eventPackages={eventPackages}
              onAddEventPackage={handleAddEventPackage}
              onUpdateEventPackage={handleUpdateEventPackage}
              onDeleteEventPackage={handleDeleteEventPackage}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ReservationsManagementPage;
