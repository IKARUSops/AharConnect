import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import AppTheme from '../../../../../shared-theme/AppTheme';
import ColorModeSelect from '../../../../../shared-theme/ColorModeSelect';
import { TextField, Button, Container, Typography, Box, Chip, Paper, IconButton, InputAdornment } from '@mui/material';
import { RestaurantCard } from '../../components/ui/restaurant-card';
import { mockRestaurants } from '../../lib/mock-data';
import Layout from '../../components/layout/Layout';
import LocationBasedRestaurants from '../../components/customer/LocationBasedRestaurants';
import { Filter, Search } from 'lucide-react';

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
            minHeight: '100%',
            bgcolor: 'background.default',
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
        <Box sx={{ bgcolor: 'primary.light', py: 6 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: 'text.primary' }}>
              Find Your Perfect Dining Experience
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <LocationBasedRestaurants onLocationChange={handleLocationChange} />
            </Box>
            
            <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  placeholder="Search restaurants, cuisines, or locations..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowFilterMobile(!showFilterMobile)}>
                          <Filter size={20} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ minWidth: 120 }}
                >
                  Search
                </Button>
              </Stack>
            </Paper>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip
                label="All Restaurants"
                onClick={() => handleFilterChange(null)}
                color={selectedFilter === null ? "primary" : "default"}
                variant={selectedFilter === null ? "filled" : "outlined"}
                sx={{ borderRadius: '20px' }}
              />
              {cuisineTypes.map((cuisine, index) => (
                <Chip
                  key={index}
                  label={cuisine}
                  onClick={() => handleFilterChange(cuisine)}
                  color={selectedFilter === cuisine ? "primary" : "default"}
                  variant={selectedFilter === cuisine ? "filled" : "outlined"}
                  sx={{ borderRadius: '20px' }}
                />
              ))}
              {priceRanges.map((price, index) => (
                <Chip
                  key={`price-${index}`}
                  label={price}
                  onClick={() => handleFilterChange(price)}
                  color={selectedFilter === price ? "primary" : "default"}
                  variant={selectedFilter === price ? "filled" : "outlined"}
                  sx={{ borderRadius: '20px' }}
                />
              ))}
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 'medium' }}>
            {filteredRestaurants.length} Restaurants Found near {location}
          </Typography>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: 3
          }}>
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </Box>

          {filteredRestaurants.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No restaurants found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your filters or search term.
              </Typography>
            </Box>
          )}
        </Container>
      </Stack>
    </AppTheme>
  );
};

export default RestaurantsPage;
