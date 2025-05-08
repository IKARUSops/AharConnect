import React from 'react';
import { format } from 'date-fns';
import { CalendarCheck, MessageCircle, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import Button from '../../components/ui/button';
import Separator from '../../components/ui/separator';

export const EventBookingConfirmation = ({
  bookingRef,
  eventSpace,
  eventPackage,
  date,
  startTime,
  endTime,
  customerName,
  customerEmail,
  customerPhone,
  specialRequests,
  partySize,
  onContactRestaurant
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CalendarCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your event booking has been confirmed. A confirmation has been sent to your email and phone.</p>
      </div>
      
      <Card>
        <CardHeader className="bg-primary/10">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Event Booking Details</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Booking Reference: {bookingRef}</p>
            </div>
            <Button
              variant="outline"
              className="bg-white"
              onClick={() => window.print()}
            >
              Print Details
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Venue</h3>
                <p className="font-medium">{eventSpace.name}</p>
                <p className="text-sm text-gray-600">{eventSpace.restaurantName}</p>
                <p className="text-sm text-gray-600">{eventSpace.address}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
                <p className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</p>
                <p className="text-sm text-gray-600">{startTime} - {endTime}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Selected Package</h3>
              <div className="bg-gray-50 border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{eventPackage.name}</p>
                    <p className="text-sm text-gray-600">{eventPackage.description}</p>
                  </div>
                  <p className="font-bold">${eventPackage.price.toFixed(2)}</p>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm">For {partySize} guests</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Your Information</h3>
                <p className="font-medium">{customerName}</p>
                <p className="text-sm text-gray-600">{customerEmail}</p>
                <p className="text-sm text-gray-600">{customerPhone}</p>
              </div>
              
              {specialRequests && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Special Requests</h3>
                  <p className="text-sm text-gray-600">{specialRequests}</p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Next Steps</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <CalendarCheck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Add to Calendar</p>
                    <p className="text-sm text-gray-600">Don't forget to add this event to your calendar</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="mr-2">Google Calendar</Button>
                      <Button variant="outline" size="sm">Apple Calendar</Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <MessageCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Need to discuss details?</p>
                    <p className="text-sm text-gray-600">Contact the restaurant directly to discuss any specific requirements</p>
                    <div className="mt-2">
                      <Button onClick={onContactRestaurant}>
                        Message Restaurant
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
