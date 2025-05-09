import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import AppTheme from '../../../../../shared-theme/AppTheme';
import ColorModeSelect from '../../../../../shared-theme/ColorModeSelect';
import { TextField, Button, Container, Typography, Box, Chip, Paper, IconButton, InputAdornment, useTheme } from '@mui/material';
import { RestaurantCard } from '../../components/ui/restaurant-card';
import { mockRestaurants } from '../../lib/mock-data';
import Layout from '../../components/layout/Layout';
import LocationBasedRestaurants from '../../components/customer/LocationBasedRestaurants';
import { Filter, Search, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/**
 * @param {Object} props
 * @param {boolean} [props.disableCustomTheme]
 */
const RestaurantsPage = (props) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [location, setLocation] = useState("New York");
  const [showFilterMobile, setShowFilterMobile] = useState(false);

  const { data: apiRestaurants = [] } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/restaurants');
        return response.data;
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        return [];
      }
    }
  });

  const allRestaurants = [...mockRestaurants, ...apiRestaurants];

  // Get all unique cuisine types from the combined data
  const cuisineTypes = Array.from(
    new Set(allRestaurants.flatMap(restaurant => restaurant.cuisineType))
  );

  // Get all unique price ranges from the combined data
  const priceRanges = Array.from(
    new Set(allRestaurants.map(restaurant => restaurant.priceRange))
  );

  const filteredRestaurants = allRestaurants.filter(restaurant => {
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
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000 }} />
      <Box
        sx={{
          minHeight: '100%',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'brightness(0.7)',
            zIndex: -2,
          },
          '&::after': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: -1,
          }
        }}
      >
        {/* Hero Section */}
        <Box 
          sx={{ 
            position: 'relative',
            py: { xs: 8, md: 12 },
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
              zIndex: 0,
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                mb: 3, 
                fontWeight: 'bold', 
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Discover Culinary Excellence
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '600px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              Find the perfect restaurant for your next dining experience
            </Typography>
            
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3, 
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: 2,
                maxWidth: '800px'
              }}
            >
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
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.8)',
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ 
                    minWidth: 120,
                    height: 56,
                    borderRadius: 2,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  Search
                </Button>
              </Stack>
            </Paper>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
              <MapPin size={20} />
              <LocationBasedRestaurants onLocationChange={handleLocationChange} />
            </Box>
          </Container>
        </Box>

        {/* Filters Section */}
        <Box 
          sx={{ 
            py: 4,
            bgcolor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="All Restaurants"
                onClick={() => handleFilterChange(null)}
                color={selectedFilter === null ? "primary" : "default"}
                variant={selectedFilter === null ? "filled" : "outlined"}
                sx={{ 
                  borderRadius: '20px',
                  bgcolor: selectedFilter === null ? 'primary.main' : 'rgba(255,255,255,0.9)',
                  '&:hover': {
                    bgcolor: selectedFilter === null ? 'primary.dark' : 'rgba(255,255,255,1)',
                  }
                }}
              />
              {cuisineTypes.map((cuisine, index) => (
                <Chip
                  key={index}
                  label={cuisine}
                  onClick={() => handleFilterChange(cuisine)}
                  color={selectedFilter === cuisine ? "primary" : "default"}
                  variant={selectedFilter === cuisine ? "filled" : "outlined"}
                  sx={{ 
                    borderRadius: '20px',
                    bgcolor: selectedFilter === cuisine ? 'primary.main' : 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      bgcolor: selectedFilter === cuisine ? 'primary.dark' : 'rgba(255,255,255,1)',
                    }
                  }}
                />
              ))}
              {priceRanges.map((price, index) => (
                <Chip
                  key={`price-${index}`}
                  label={price}
                  onClick={() => handleFilterChange(price)}
                  color={selectedFilter === price ? "primary" : "default"}
                  variant={selectedFilter === price ? "filled" : "outlined"}
                  sx={{ 
                    borderRadius: '20px',
                    bgcolor: selectedFilter === price ? 'primary.main' : 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      bgcolor: selectedFilter === price ? 'primary.dark' : 'rgba(255,255,255,1)',
                    }
                  }}
                />
              ))}
            </Box>
          </Container>
        </Box>

        {/* Results Section */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              mb: 4, 
              fontWeight: 'medium',
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <MapPin size={24} />
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
              <RestaurantCard key={restaurant.id || restaurant._id} restaurant={restaurant} />
            ))}
          </Box>

          {filteredRestaurants.length === 0 && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 6,
                bgcolor: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: 2,
                p: 4
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No restaurants found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your filters or search term.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </AppTheme>
  );
};

export default RestaurantsPage;
