import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, TextField, InputAdornment, IconButton, Chip, Stack, Rating, CircularProgress } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon, LocationOn, Star, StarBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import AppTheme from '../../../shared-theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import ColorModeSelect from '../../../shared-theme/ColorModeSelect';

// Mock data for restaurants
const mockRestaurants = [
  {
    id: '1',
    name: 'The Italian Place',
    cuisine: 'Italian',
    rating: 4.5,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2370&auto=format&fit=crop',
    description: 'Authentic Italian cuisine in a cozy atmosphere',
    address: '123 Main St, New York, NY',
    openingHours: '11:00 AM - 10:00 PM',
    deliveryTime: '30-45 min',
    deliveryFee: '$2.99',
    minOrder: '$15',
  },
  {
    id: '2',
    name: 'Sakura Japanese',
    cuisine: 'Japanese',
    rating: 4.8,
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=2370&auto=format&fit=crop',
    description: 'Fresh sushi and traditional Japanese dishes',
    address: '456 Elm St, New York, NY',
    openingHours: '12:00 PM - 11:00 PM',
    deliveryTime: '40-55 min',
    deliveryFee: '$3.99',
    minOrder: '$20',
  },
  {
    id: '3',
    name: 'The Steakhouse',
    cuisine: 'American',
    rating: 4.6,
    priceRange: '$$$$',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2369&auto=format&fit=crop',
    description: 'Premium steaks and classic American fare',
    address: '789 Oak St, New York, NY',
    openingHours: '5:00 PM - 11:00 PM',
    deliveryTime: '45-60 min',
    deliveryFee: '$4.99',
    minOrder: '$25',
  },
  {
    id: '4',
    name: 'Spice Garden',
    cuisine: 'Indian',
    rating: 4.4,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2370&auto=format&fit=crop',
    description: 'Authentic Indian cuisine with modern twists',
    address: '321 Pine St, New York, NY',
    openingHours: '11:30 AM - 10:30 PM',
    deliveryTime: '35-50 min',
    deliveryFee: '$2.99',
    minOrder: '$15',
  },
  {
    id: '5',
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    rating: 4.3,
    priceRange: '$',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=2380&auto=format&fit=crop',
    description: 'Fresh and flavorful Mexican street food',
    address: '654 Maple St, New York, NY',
    openingHours: '10:00 AM - 9:00 PM',
    deliveryTime: '25-40 min',
    deliveryFee: '$1.99',
    minOrder: '$10',
  },
  {
    id: '6',
    name: 'Golden Dragon',
    cuisine: 'Chinese',
    rating: 4.2,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=2370&auto=format&fit=crop',
    description: 'Traditional Chinese cuisine with a modern touch',
    address: '987 Cedar St, New York, NY',
    openingHours: '11:00 AM - 10:00 PM',
    deliveryTime: '30-45 min',
    deliveryFee: '$2.99',
    minOrder: '$15',
  }
];

// Available cuisines for filter
const cuisines = ['Italian', 'Japanese', 'American', 'Indian', 'Mexican', 'Chinese'];

// Price ranges for filter
const priceRanges = ['$', '$$', '$$$', '$$$$'];

// Ratings for filter
const ratings = [4.5, 4.0, 3.5, 3.0];

export default function RestaurantsPage(props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // Filter restaurants based on search and filters
  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCuisine = !selectedCuisine || restaurant.cuisine === selectedCuisine;
    const matchesPrice = !selectedPriceRange || restaurant.priceRange === selectedPriceRange;
    const matchesRating = !selectedRating || restaurant.rating >= parseFloat(selectedRating);
    
    return matchesSearch && matchesCuisine && matchesPrice && matchesRating;
  });

  const handleLocationSearch = () => {
    // Implement location search logic
    console.log('Searching for location:', location);
  };

  const handleClearFilters = () => {
    setSelectedCuisine('');
    setSelectedPriceRange('');
    setSelectedRating('');
    setSortBy('rating');
    setActiveFilters([]);
  };

  const handleRemoveFilter = (filter) => {
    switch (filter.type) {
      case 'cuisine':
        setSelectedCuisine('');
        break;
      case 'price':
        setSelectedPriceRange('');
        break;
      case 'rating':
        setSelectedRating('');
        break;
      default:
        break;
    }
    setActiveFilters(activeFilters.filter(f => f.type !== filter.type));
  };

  const handleViewDetails = (restaurantId) => {
    // Implement view details logic
    console.log('Viewing details for restaurant:', restaurantId);
  };

  const handleAddToCart = (restaurant) => {
    // Implement add to cart logic
    console.log('Adding to cart:', restaurant);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Discover Restaurants
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Find the best restaurants in your area
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                fullWidth
              >
                Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<LocationOn />}
                onClick={() => setShowLocationFilter(!showLocationFilter)}
                fullWidth
              >
                Location
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Filters Section */}
      {showFilters && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Cuisine"
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">All Cuisines</option>
                {cuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Price Range"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">All Prices</option>
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Rating"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">All Ratings</option>
                {ratings.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Stars
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="rating">Rating</option>
                <option value="price">Price</option>
                <option value="distance">Distance</option>
              </TextField>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Location Filter Section */}
      {showLocationFilter && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Enter Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleLocationSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Distance (km)"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">km</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {activeFilters.map((filter) => (
              <Chip
                key={filter.label}
                label={filter.label}
                onDelete={() => handleRemoveFilter(filter)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Restaurant Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredRestaurants.map((restaurant) => (
            <Grid item key={restaurant.id} xs={12} sm={6} md={4}>
              <RestaurantCard
                restaurant={restaurant}
                onViewDetails={() => handleViewDetails(restaurant.id)}
                onAddToCart={() => handleAddToCart(restaurant)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* No Results Message */}
      {!loading && filteredRestaurants.length === 0 && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No restaurants found matching your criteria
          </Typography>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            sx={{ mt: 2 }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Container>
  );
} 