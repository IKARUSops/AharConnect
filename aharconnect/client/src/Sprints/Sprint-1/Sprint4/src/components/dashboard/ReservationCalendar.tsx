
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Reservation, EventBooking } from '@/lib/types';

interface ReservationCalendarProps {
  reservations: Reservation[];
  eventBookings: EventBooking[];
  onDateSelect: (date: Date) => void;
}

export default function ReservationCalendar({ 
  reservations, 
  eventBookings,
  onDateSelect 
}: ReservationCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get reservations for the selected date
  const getReservationsForDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return reservations.filter(res => res.date === formattedDate);
  };
  
  // Get event bookings for the selected date
  const getEventBookingsForDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return eventBookings.filter(event => event.date === formattedDate);
  };

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect(date);
    }
  };
  
  // Count reservations per date for highlighting in calendar
  const getReservationDates = () => {
    const dates = new Map<string, number>();
    
    reservations.forEach(res => {
      const count = dates.get(res.date) || 0;
      dates.set(res.date, count + 1);
    });
    
    eventBookings.forEach(event => {
      const count = dates.get(event.date) || 0;
      dates.set(event.date, count + 1);
    });
    
    return dates;
  };
  
  const reservationDates = getReservationDates();
  
  const selectedDateReservations = selectedDate ? getReservationsForDate(selectedDate) : [];
  const selectedDateEvents = selectedDate ? getEventBookingsForDate(selectedDate) : [];
  
  const formatTime = (time: string) => {
    // Format from 24h to 12h format
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="w-full md:w-auto">
        <CardHeader>
          <CardTitle>Reservations Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar 
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            className="border rounded-md"
            modifiers={{
              booked: (date) => {
                const formattedDate = format(date, 'yyyy-MM-dd');
                return reservationDates.has(formattedDate);
              }
            }}
            modifiersClassNames={{
              booked: "bg-blue-100 font-bold text-blue-800"
            }}
            components={{
              DayContent: (props) => {
                const formattedDate = format(props.date, 'yyyy-MM-dd');
                const count = reservationDates.get(formattedDate) || 0;
                
                if (count > 0) {
                  return (
                    <div title={`${count} booking(s)`} className="w-full h-full flex items-center justify-center">
                      {props.date.getDate()}
                    </div>
                  );
                }
                return <>{props.date.getDate()}</>;
              }
            }}
          />
        </CardContent>
      </Card>
      
      <div className="flex-grow">
        {selectedDate && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                Today
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedDateReservations.length > 0 || selectedDateEvents.length > 0 ? (
                  <>
                    {selectedDateReservations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Table Reservations</h3>
                        <div className="space-y-3">
                          {selectedDateReservations.map((reservation) => (
                            <div key={reservation.id} className="bg-white rounded-lg border p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{reservation.customerName}</p>
                                  <p className="text-sm text-gray-500">
                                    Party of {reservation.partySize} at {formatTime(reservation.time)}
                                  </p>
                                  {reservation.tableNumber && (
                                    <p className="text-sm">Table #{reservation.tableNumber}</p>
                                  )}
                                </div>
                                <Badge className={
                                  reservation.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : reservation.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }>
                                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                </Badge>
                              </div>
                              {reservation.specialRequests && (
                                <p className="text-sm mt-2 text-gray-600">
                                  <span className="font-medium">Note:</span> {reservation.specialRequests}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedDateEvents.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Event Bookings</h3>
                        <div className="space-y-3">
                          {selectedDateEvents.map((event) => (
                            <div key={event.id} className="bg-white rounded-lg border p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{event.customerName}</p>
                                  <p className="text-sm text-gray-500">
                                    Party of {event.partySize} • {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                  </p>
                                </div>
                                <Badge className={
                                  event.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-800'
                                    : event.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }>
                                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm mt-1">
                                <span className="font-medium">Total:</span> ${event.totalAmount.toFixed(2)}
                              </p>
                              {event.specialRequests && (
                                <p className="text-sm mt-1 text-gray-600">
                                  <span className="font-medium">Note:</span> {event.specialRequests}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No bookings for this date</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
