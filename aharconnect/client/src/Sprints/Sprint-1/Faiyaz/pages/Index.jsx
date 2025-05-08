import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { MapPin, Utensils, Calendar, Users } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 py-16 md:py-24">
        <div className="ahar-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-ahar-dark mb-4">Welcome to AharConnect</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing restaurants, book tables, order food online, and plan events - all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-[#B48CF2] hover:bg-[#9B6FE0] text-white font-medium shadow-sm hover:shadow-md transition-all">
              <Link to="/restaurants" className="text-white">Find Restaurants</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/events">Book Event Space</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="py-12 md:py-16 ahar-container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Discover AharConnect Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="h-full">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[#F3EAFF] flex items-center justify-center mb-2">
                <MapPin className="text-[#B48CF2]" size={24} />
              </div>
              <CardTitle>Find Nearby Restaurants</CardTitle>
              <CardDescription>Explore restaurants in your area with detailed information and reviews.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full bg-[#B48CF2] hover:bg-[#9B6FE0] text-white font-medium shadow-sm hover:shadow-md transition-all">
                <Link to="/restaurants" className="text-white">Explore Restaurants</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="h-full">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[#F3EAFF] flex items-center justify-center mb-2">
                <Utensils className="text-[#B48CF2]" size={24} />
              </div>
              <CardTitle>Order Online</CardTitle>
              <CardDescription>Order your favorite meals for pickup or delivery from top restaurants.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full bg-[#B48CF2] hover:bg-[#9B6FE0] text-white font-medium shadow-sm hover:shadow-md transition-all">
                <Link to="/restaurants" className="text-white">Browse Menus</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="h-full">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[#F3EAFF] flex items-center justify-center mb-2">
                <Calendar className="text-[#B48CF2]" size={24} />
              </div>
              <CardTitle>Table Reservations</CardTitle>
              <CardDescription>Book tables at your favorite restaurants and skip the wait.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full bg-[#B48CF2] hover:bg-[#9B6FE0] text-white font-medium shadow-sm hover:shadow-md transition-all">
                <Link to="/restaurants" className="text-white">Make Reservation</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="h-full">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[#F3EAFF] flex items-center justify-center mb-2">
                <Users className="text-[#B48CF2]" size={24} />
              </div>
              <CardTitle>Event Spaces</CardTitle>
              <CardDescription>Find and book venues for parties, corporate events, and special occasions.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full bg-[#B48CF2] hover:bg-[#9B6FE0] text-white font-medium shadow-sm hover:shadow-md transition-all">
                <Link to="/events" className="text-white">Book Event Space</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="bg-[#F3F6F9] py-12 md:py-16">
        <div className="ahar-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Are you a restaurant owner?</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Join AharConnect and boost your restaurant's visibility. Manage reservations, online orders, and events all in one place.
          </p>
          <Button asChild size="lg" className="bg-[#B48CF2] hover:bg-[#9B6FE0] text-white font-medium shadow-sm hover:shadow-md transition-all">
            <Link to="/restaurant-dashboard" className="text-white">Restaurant Dashboard</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
