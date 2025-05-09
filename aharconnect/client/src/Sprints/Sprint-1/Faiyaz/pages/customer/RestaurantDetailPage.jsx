import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import AppTheme from '../../../../../shared-theme/AppTheme';
import ColorModeSelect from '../../../../../shared-theme/ColorModeSelect';
import { MapPin, Star, Filter } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import Button from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import Input from '../../components/ui/input';
import Separator from '../../components/ui/separator';
import { toast } from 'sonner';
import Layout from '../../components/layout/Layout';
import { MenuItemCard } from '../../components/customer/MenuItemCard';
import { CartDrawer } from '../../components/customer/CartDrawer';
import axios from 'axios';

const RestaurantDetailPage = (props) => {
  const { id } = useParams();
  console.log("Route parameters:", useParams()); // Log the entire useParams object for debugging

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      if (!id) {
        console.error("Restaurant ID is undefined");
        throw new Error("Restaurant ID is undefined");
      }
      const restaurant = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
      if (!restaurant) throw new Error('Restaurant not found');
      return restaurant.data;
    },
    enabled: !!id, // Only run query if id is defined
  });

  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['menu', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/inventory/menu/${id}`);
        console.log("Fetching menu for restaurant ID:", id);
        return response.data;
      } catch (error) {
        console.error('Error fetching menu items:', error);
        return [];
      }
    },
    enabled: !!id, // Only run query if id is defined
  });

  if (!id) {
    console.warn("Restaurant ID is missing from the route parameters.");
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <Stack
          direction="column"
          component="main"
          sx={{
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
          }}
        >
          <h1>Restaurant ID is missing. Please check the URL.</h1>
        </Stack>
      </AppTheme>
    );
  }

  const menuItemsArray = Array.isArray(menuItems) ? menuItems : [];
  console.log("Menu items fetched:", menuItemsArray);
  const categories = [
    'all',
    ...Array.from(new Set(menuItemsArray.map(item => item.category)))
  ];

  const filteredMenuItems = menuItemsArray.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (restaurantLoading) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Stack
          direction="column"
          component="main"
          sx={{
            justifyContent: 'center',
            height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
            marginTop: 'max(40px - var(--template-frame-height, 0px), 0px)',
            minHeight: '100%',
            '&::before': {
              content: '""',
              display: 'block',
              position: 'fixed',
              zIndex: -1,
              inset: 0,
              backgroundImage:
                'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
              backgroundRepeat: 'no-repeat'
            }
          }}
        >
          <div className="ahar-container py-12">
            <div className="animate-pulse">
              <div className="h-60 bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </Stack>
      </AppTheme>
    );
  }

  if (!restaurant) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Stack
          direction="column"
          component="main"
          sx={{
            justifyContent: 'center',
            height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
            marginTop: 'max(40px - var(--template-frame-height, 0px), 0px)',
            minHeight: '100%',
          }}
        >
          <div className="ahar-container py-12">
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Restaurant Not Found</h1>
              <p className="text-gray-600 mb-6">The restaurant you're looking for doesn't exist or may have been removed.</p>
              <Button asChild>
                <Link to="/restaurants">Back to Restaurants</Link>
              </Button>
            </div>
          </div>
        </Stack>
      </AppTheme>
    );
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <Stack
        direction="column"
        component="main"
        sx={{
          justifyContent: 'center',
          height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
          marginTop: 'max(40px - var(--template-frame-height, 0px), 0px)',
          minHeight: '100%',
          '&::before': {
            content: '""',
            display: 'block',
            position: 'fixed',
            zIndex: -1,
            inset: 0,
            backgroundImage:
              'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
            backgroundRepeat: 'no-repeat'
          }
        }}
      >
        <div className="relative">
          {/* Restaurant Header Image */}
          <div className="relative h-60 sm:h-80 bg-gray-900">
            <img
              src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop'}
              alt={restaurant.name}
              className="w-full h-full object-cover opacity-70"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="ahar-container">
                <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{restaurant.address}</span>
                  </div>
                  <div className="flex items-center px-2 py-1 bg-yellow-500/80 rounded text-black">
                    <Star size={14} className="mr-1" />
                    <span className="text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
                  </div>
                  <div className="text-sm">{restaurant.priceRange}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {restaurant.cuisineType?.map((cuisine, index) => (
                    <Badge key={index} variant="outline" className="bg-white/10 text-white border-white/20">
                      {cuisine}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Info and Menu */}
          <div className="ahar-container py-8">
            <Tabs defaultValue="menu" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="menu" className="space-y-6">
                {/* Search and Filter Area */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Filter size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                  {categories.map((category, index) => (
                    <Button
                      key={index}
                      variant={activeCategory === category ? "default" : "outline"}
                      className="capitalize whitespace-nowrap"
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Menu Items Grid */}
                {filteredMenuItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredMenuItems.map((item) => (
                      <MenuItemCard key={item.id} menuItem={item} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600">No menu items available for this restaurant.</p>
                )}
              </TabsContent>

              <TabsContent value="info" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">About {restaurant.name}</h3>
                  <p className="text-gray-600 mb-6">{restaurant.description}</p>
                  
                  <h4 className="font-semibold mb-2">Hours of Operation</h4>
                  <p className="text-gray-600 mb-4">
                    {restaurant.openingHours.opening} - {restaurant.openingHours.closing}, Daily
                  </p>
                  
                  <Separator className="my-4" />
                  
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <p className="text-gray-600">Phone: {restaurant.phoneNumber}</p>
                  <p className="text-gray-600 mb-4">Email: {restaurant.email}</p>
                  
                  <h4 className="font-semibold mb-2">Address</h4>
                  <p className="text-gray-600">{restaurant.address}</p>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-4">Reviews Coming Soon</h3>
                  <p className="text-gray-600">
                    We're working on gathering reviews for this restaurant. Check back later!
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <CartDrawer />
      </Stack>
    </AppTheme>
  );
};

export default RestaurantDetailPage;
