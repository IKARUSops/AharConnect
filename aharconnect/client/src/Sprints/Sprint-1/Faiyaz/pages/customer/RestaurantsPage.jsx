import React, { useState, useEffect, useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import AppTheme from '../../../../../shared-theme/AppTheme';
import ColorModeSelect from '../../../../../shared-theme/ColorModeSelect';
import { TextField, Button, Container, Typography, Box, Chip, Paper, IconButton, InputAdornment, useTheme } from '@mui/material';
import { RestaurantCard } from '../../components/ui/restaurant-card';
import Layout from '../../components/layout/Layout';
import LocationBasedRestaurants from '../../components/customer/LocationBasedRestaurants';
import LocationAutocomplete from '../../../../../components/customer/LocationAutocomplete';
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
  const [location, setLocation] = useState(null);
  const [showFilterMobile, setShowFilterMobile] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [viewMode, setViewMode] = useState('all');
  const [userCoordinates, setUserCoordinates] = useState(null);

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

  // Memoize allRestaurants to prevent recreation on every render
  const allRestaurants = useMemo(() => [...apiRestaurants], [apiRestaurants]);

  // Memoize cuisine types and price ranges
  const cuisineTypes = useMemo(() => 
    Array.from(new Set(allRestaurants.flatMap(restaurant => restaurant.cuisineType))),
    [allRestaurants]
  );

  const priceRanges = useMemo(() =>
    Array.from(new Set(allRestaurants.map(restaurant => restaurant.priceRange))),
    [allRestaurants]
  );

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  // Function to calculate address match score
  const calculateAddressMatchScore = (restaurantAddress, searchLocation) => {
    if (!restaurantAddress || !searchLocation) return 0;
    
    // Convert both addresses to lowercase for comparison
    const restAddress = restaurantAddress.toLowerCase();
    const searchAddr = searchLocation.toLowerCase();
    
    console.log('Matching addresses:', {
      restaurant: restAddress,
      search: searchAddr
    });

    // Important areas in Dhaka
    const dhakaAreas = [
      'dhaka',
      'cantonment',
      'gulshan',
      'banani',
      'dhanmondi',
      'mirpur',
      'uttara',
      'mohakhali',
      'tejgaon',
      'motijheel'
    ];

    let score = 0;

    // Check if both addresses mention Dhaka
    if (restAddress.includes('dhaka') && searchAddr.includes('dhaka')) {
      score += 5;
      console.log('Dhaka match found, score:', score);
    }

    // Check for specific area matches
    dhakaAreas.forEach(area => {
      if (restAddress.includes(area) && searchAddr.includes(area)) {
        score += 10;
        console.log(`Area match found: ${area}, score:`, score);
      }
    });

    // If one address has cantonment and the other has dhaka cantonment, it's a match
    if ((restAddress.includes('cantonment') && searchAddr.includes('dhaka cantonment')) ||
        (restAddress.includes('dhaka cantonment') && searchAddr.includes('cantonment'))) {
      score += 10;
      console.log('Cantonment match found, score:', score);
    }

    // Check individual words (excluding common words)
    const searchWords = searchAddr.split(/[\s,]+/);
    const commonWords = ['road', 'street', 'lane', 'avenue', 'the', 'and', 'near', 'beside', 'behind', 'in', 'at'];
    
    searchWords.forEach(word => {
      if (word.length > 2 && !commonWords.includes(word) && restAddress.includes(word)) {
        score += 2;
        console.log(`Word match found: ${word}, score:`, score);
      }
    });

    console.log('Final match score:', score);
    return score;
  };

  // Memoize filterRestaurantsByLocation function to prevent recreation on every render
  const filterRestaurantsByLocation = React.useCallback((coordinates, locationName) => {
    console.log('Filtering restaurants for location:', locationName);
    console.log('Available restaurants:', allRestaurants);

    let matchedRestaurants = allRestaurants.map(restaurant => {
      let score = 0;
      let distance = Infinity;
      let matchType = 'none';
      
      // Calculate coordinate-based distance if coordinates available
      if (coordinates && restaurant.coordinates) {
        distance = calculateDistance(
          coordinates.lat,
          coordinates.lng,
          restaurant.coordinates.lat,
          restaurant.coordinates.lng
        );
        // Add distance-based score (closer = higher score)
        if (distance <= 10) { // 10km radius
          score += Math.max(0, 10 - distance) * 2;
          matchType = 'coordinates';
        }
      }
      
      // Calculate address match score
      const addressScore = calculateAddressMatchScore(restaurant.address, locationName);
      console.log('Address match score for', restaurant.name, ':', addressScore);
      
      if (addressScore > 0) {
        score += addressScore;
        matchType = matchType === 'coordinates' ? 'both' : 'address';
      }
      
      return {
        ...restaurant,
        distance: distance === Infinity ? undefined : Math.round(distance * 10) / 10,
        matchScore: score,
        matchType
      };
    });
    
    // Filter and sort by match score
    matchedRestaurants = matchedRestaurants
      .filter(restaurant => restaurant.matchScore > 0) // Only keep restaurants with some match
      .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score

    console.log('Matched restaurants:', matchedRestaurants);
    setFilteredRestaurants(matchedRestaurants);
  }, [allRestaurants]);

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserCoordinates(coords);
          
          try {
            // Use OpenStreetMap's Nominatim for reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
            );
            
            if (!response.ok) {
              throw new Error('Failed to fetch location data');
            }
            
            const data = await response.json();
            const locationData = {
              name: data.display_name,
              coordinates: coords
            };
            
            setLocation(locationData);
            filterRestaurantsByLocation(coords, data.display_name);
          } catch (error) {
            console.error('Error getting location name:', error);
            // Fallback to using coordinates as the location name
            const locationData = {
              name: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
              coordinates: coords
            };
            setLocation(locationData);
            filterRestaurantsByLocation(coords, locationData.name);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleLocationSelect = (newLocation) => {
    setLocation(newLocation);
    if (newLocation?.coordinates) {
      filterRestaurantsByLocation(newLocation.coordinates, newLocation.name);
    }
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    // First filter by search query
    let results = allRestaurants.filter(restaurant => {
      return restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisineType.some(cuisine => cuisine.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    
    // Then apply location filter if in location mode
    if (viewMode === 'location') {
      results = results.filter(restaurant => 
        restaurant.location?.toLowerCase().includes(location?.name?.toLowerCase())
      );
    }
    
    // Update the filtered results
    setFilteredRestaurants(results);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'all') {
      setFilteredRestaurants(allRestaurants);
    } else {
      // Filter by current location
      if (userCoordinates) {
        filterRestaurantsByLocation(userCoordinates, location?.name);
      }
    }
  };

  // Update filtered results when location changes or view mode changes
  useEffect(() => {
    if (!allRestaurants.length) return; // Early return if no restaurants

    if (viewMode === 'location' && userCoordinates && location?.name) {
      filterRestaurantsByLocation(userCoordinates, location.name);
    } else if (viewMode === 'all') {
      setFilteredRestaurants(allRestaurants);
    }
  }, [viewMode, userCoordinates, location?.name, filterRestaurantsByLocation, allRestaurants]);

  // Initialize filtered results when restaurants data changes
  useEffect(() => {
    if (!allRestaurants.length) return; // Early return if no restaurants
    
    if (viewMode === 'all') {
      setFilteredRestaurants(allRestaurants);
    }
  }, [allRestaurants, viewMode]);

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
            py: { xs: 10, md: 15 }, // Increased vertical padding
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
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Discover Culinary Excellence
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 5, // Increased bottom margin
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '600px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                textAlign: { xs: 'center', md: 'left' },
                mx: { xs: 'auto', md: 0 } // Center on mobile, left align on desktop
              }}
            >
              Find the perfect restaurant for your next dining experience
            </Typography>
            
            <Paper 
              component="form"
              onSubmit={handleSearchSubmit}
              elevation={0} 
              sx={{ 
                p: { xs: 2.5, md: 4 }, // Increased padding
                mb: 4,
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: 3,
                maxWidth: '800px',
                mx: { xs: 'auto', md: 0 } // Center on mobile, left align on desktop
              }}
            >
              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                spacing={{ xs: 2.5, md: 2.5 }} // Consistent spacing
                alignItems="stretch"
                sx={{ height: { md: '60px' } }} // Fixed height on desktop
              >
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
                    sx: { height: '100%' }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.8)',
                      height: '100%'
                    }
                  }}
                />
                <Button 
                  type="submit"
                  variant="contained" 
                  color="primary"
                  sx={{ 
                    minWidth: { xs: '100%', md: 120 },
                    height: { xs: 56, md: '100%' },
                    borderRadius: 2,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  Search
                </Button>
              </Stack>
            </Paper>

            {/* Location Section */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                mb: 3,
                flexDirection: { xs: 'column', md: 'row' }
              }}
            >
              <LocationAutocomplete onLocationSelect={handleLocationSelect} />
              <Button
                variant="outlined"
                onClick={getCurrentLocation}
                startIcon={<MapPin size={18} />}
                sx={{ 
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  },
                  whiteSpace: 'nowrap',
                  minWidth: { xs: '100%', md: 'auto' }
                }}
              >
                Use Current Location
              </Button>
            </Box>

            {/* Location Info */}
            {location && (
              <Typography 
                sx={{ 
                  color: 'white', 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}
              >
                <MapPin size={16} />
                {location.name}
              </Typography>
            )}

            {/* View Mode Toggle */}
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ 
                mb: 4,
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}
            >
              <Button
                variant={viewMode === 'all' ? 'contained' : 'outlined'}
                onClick={() => handleViewModeChange('all')}
                startIcon={<Filter size={18} />}
                sx={{ 
                  color: viewMode === 'all' ? 'white' : 'rgba(255,255,255,0.9)',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: viewMode === 'all' ? 'primary.dark' : 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                All Restaurants
              </Button>
              <Button
                variant={viewMode === 'location' ? 'contained' : 'outlined'}
                onClick={() => handleViewModeChange('location')}
                startIcon={<MapPin size={18} />}
                sx={{ 
                  color: viewMode === 'location' ? 'white' : 'rgba(255,255,255,0.9)',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: viewMode === 'location' ? 'primary.dark' : 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Nearby Only
              </Button>
            </Stack>
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
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                variant={viewMode === 'all' ? 'contained' : 'outlined'} 
                onClick={() => handleViewModeChange('all')}
              >
                View All
              </Button>
              <Button 
                variant={viewMode === 'location' ? 'contained' : 'outlined'} 
                onClick={() => handleViewModeChange('location')}
              >
                View by Location
              </Button>
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
            {filteredRestaurants.length} Restaurants Found near {location?.name || 'your location'}
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
