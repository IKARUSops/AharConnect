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
import { MenuItem, Restaurant } from '../../lib/types';
import { mockRestaurants } from '../../lib/mock-data';
import { MenuItemCard } from '../../components/customer/MenuItemCard';
import { CartDrawer } from '../../components/customer/CartDrawer';

// Mock menu items - in a real app, these would come from an API
const mockMenuItems = [
  {
    id: '1',
    name: 'Classic Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, and our special sauce',
    price: 12.99,
    category: 'mains',
    available: true,
    preparationTime: 15,
    restaurantId: '1',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2370&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Garlic Bread',
    description: 'Freshly baked bread with garlic butter',
    price: 4.99,
    category: 'starters',
    available: true,
    preparationTime: 10,
    restaurantId: '1',
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with Caesar dressing, croutons, and parmesan',
    price: 8.99,
    category: 'starters',
    available: true,
    preparationTime: 8,
    restaurantId: '1',
  },
  {
    id: '4',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 7.99,
    category: 'desserts',
    available: true,
    preparationTime: 12,
    restaurantId: '1',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=2374&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Penne Arrabbiata',
    description: 'Penne pasta in a spicy tomato sauce with garlic and herbs',
    price: 10.99,
    category: 'mains',
    available: false,
    preparationTime: 20,
    restaurantId: '1',
  },
];

/**
 * @param {Object} props
 * @param {boolean} [props.disableCustomTheme]
 */
const RestaurantDetailPage = (props) => {
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      // Mock fetch - in a real app, this would be an API call
      const restaurant = mockRestaurants.find(r => r.id === id);
      if (!restaurant) throw new Error('Restaurant not found');
      return restaurant;
    }
  });

  const { data: menuItems = mockMenuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['menu', id],
    queryFn: async () => {
      // Mock fetch - in a real app, this would be an API call
      return mockMenuItems;
    }
  });

  const categories = [
    'all',
    ...Array.from(new Set(menuItems.map(item => item.category)))
  ];

  const filteredMenuItems = menuItems.filter(item => {
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
          sx={[
            {
              justifyContent: 'center',
              height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
              marginTop: 'max(40px - var(--template-frame-height, 0px), 0px)',
              minHeight: '100%',
            },
            (theme) => ({
              '&::before': {
                content: '""',
                display: 'block',
                position: 'fixed',
                zIndex: -1,
                inset: 0,
                backgroundImage:
                  'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                backgroundRepeat: 'no-repeat',
                ...theme.applyStyles('dark', {
                  backgroundImage:
                    'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
                  backgroundAttachment: 'fixed',
                }),
              },
            }),
          ]}
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
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover opacity-70"
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
                  {restaurant.cuisineType.map((cuisine, index) => (
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredMenuItems.map((item) => (
                      <MenuItemCard key={item.id} menuItem={item} />
                    ))}
                  </div>
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
