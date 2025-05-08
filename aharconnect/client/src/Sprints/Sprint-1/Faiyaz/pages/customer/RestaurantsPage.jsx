import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import AppTheme from '../../../../../shared-theme/AppTheme';
import ColorModeSelect from '../../../../../shared-theme/ColorModeSelect';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import { RestaurantCard } from '../../components/ui/restaurant-card';
import { mockRestaurants } from '../../lib/mock-data';
import Layout from '../../components/layout/Layout';
import LocationBasedRestaurants from '../../components/customer/LocationBasedRestaurants';
import { Filter } from 'lucide-react';

/**
 * @param {Object} props
 * @param {boolean} [props.disableCustomTheme]
 */
const RestaurantsPage = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [location, setLocation] = useState("New York");
  const [showFilterMobile, setShowFilterMobile] = useState(false);

  // Get all unique cuisine types from the mock data
  const cuisineTypes = Array.from(
    new Set(mockRestaurants.flatMap(restaurant => restaurant.cuisineType))
  );

  // Get all unique price ranges from the mock data
  const priceRanges = Array.from(
    new Set(mockRestaurants.map(restaurant => restaurant.priceRange))
  );

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    // Filter by search term
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisineType.some(cuisine => cuisine.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by selected filter
    const matchesFilter = !selectedFilter || 
      restaurant.cuisineType.includes(selectedFilter) ||
      restaurant.priceRange === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{
            justifyContent: 'center',
            gap: { xs: 6, sm: 12 },
            p: 2,
            mx: 'auto',
            width: '100%'
          }}
        >
          <div className="w-full">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 py-12">
              <div className="ahar-container">
                <h1 className="text-4xl font-bold text-ahar-dark mb-6">Find Your Perfect Dining Experience</h1>
                
                <div className="mb-8">
                  <LocationBasedRestaurants onLocationChange={handleLocationChange} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-2 relative">
                    <Input
                      type="text"
                      placeholder="Search restaurants, cuisines, or locations..."
                      className="px-4 py-3 h-12 text-base"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Button size="icon" variant="ghost">
                        <Filter size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-1 flex space-x-2">
                    <Button className="flex-1 bg-ahar-primary hover:bg-ahar-secondary">
                      Search
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center space-x-1"
                      onClick={() => setShowFilterMobile(!showFilterMobile)}
                    >
                      <Filter size={16} className="mr-1" />
                      <span>Filters</span>
                    </Button>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilterChange(null)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${selectedFilter === null ? 'bg-[#B48CF2] text-white border-transparent' : 'bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]'}`}
                  >
                    All Restaurants
                  </button>
                  {cuisineTypes.map((cuisine, index) => (
                    <button
                      key={index}
                      onClick={() => handleFilterChange(cuisine)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${selectedFilter === cuisine ? 'bg-[#B48CF2] text-white border-transparent' : 'bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]'}`}
                    >
                      {cuisine}
                    </button>
                  ))}
                  {priceRanges.map((price, index) => (
                    <button
                      key={`price-${index}`}
                      onClick={() => handleFilterChange(price)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${selectedFilter === price ? 'bg-[#B48CF2] text-white border-transparent' : 'bg-white text-black border-[#B48CF2] hover:bg-[#f3eaff]'}`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="ahar-container py-12">
              <h2 className="text-2xl font-semibold mb-6">
                {filteredRestaurants.length} Restaurants Found near {location}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map(restaurant => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>

              {filteredRestaurants.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-600">No restaurants found</h3>
                  <p className="mt-2 text-gray-500">Try adjusting your filters or search term.</p>
                </div>
              )}
            </div>
          </div>
        </Stack>
      </Stack>
    </AppTheme>
  );
};

export default RestaurantsPage;
