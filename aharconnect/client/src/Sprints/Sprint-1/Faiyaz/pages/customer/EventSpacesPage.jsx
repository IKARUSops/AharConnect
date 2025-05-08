import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Users, CalendarCheck, Filter, Search } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Typography, 
  Box, 
  Chip, 
  Button, 
  Container, 
  Stack, 
  TextField, 
  IconButton, 
  InputAdornment,
  Paper,
  Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import AppTheme from '../../../../../shared-theme/AppTheme';
import { CssBaseline } from '@mui/material';
import Layout from '../../components/layout/Layout';

// Mock event spaces data
const mockEventSpaces = [
  {
    id: '1',
    name: 'Grand Hall',
    restaurantId: '1',
    restaurantName: 'The Italian Place',
    description: 'A spacious hall perfect for large gatherings, weddings, and corporate events.',
    capacity: 200,
    pricePerHour: 350,
    minHours: 4,
    availability: 'Available',
    amenities: ['Tables & Chairs', 'Sound System', 'Projector', 'Wi-Fi', 'Air Conditioning'],
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2370&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=2370&auto=format&fit=crop',
    ],
    address: '123 Main St, New York, NY',
  },
  {
    id: '2',
    name: 'Garden Terrace',
    restaurantId: '2',
    restaurantName: 'Sakura Japanese',
    description: 'A beautiful outdoor space surrounded by lush gardens, perfect for intimate gatherings.',
    capacity: 80,
    pricePerHour: 250,
    minHours: 3,
    availability: 'Available',
    amenities: ['Tables & Chairs', 'Outdoor Heaters', 'String Lights', 'Tent Option'],
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2370&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=2370&auto=format&fit=crop',
    ],
    address: '456 Elm St, New York, NY',
  },
  {
    id: '3',
    name: 'VIP Lounge',
    restaurantId: '3',
    restaurantName: 'The Steakhouse',
    description: 'An exclusive lounge with premium amenities for sophisticated events and gatherings.',
    capacity: 50,
    pricePerHour: 300,
    minHours: 2,
    availability: 'Booked',
    amenities: ['Premium Bar', 'Private Restrooms', 'DJ Booth', 'Security'],
    images: [
      'https://images.unsplash.com/photo-1517659649778-bae24b8c2e26?q=80&w=2369&auto=format&fit=crop',
    ],
    address: '789 Oak St, New York, NY',
  },
  {
    id: '4',
    name: 'Rooftop Venue',
    restaurantId: '1',
    restaurantName: 'The Italian Place',
    description: 'Stunning rooftop venue with panoramic city views, perfect for special celebrations.',
    capacity: 120,
    pricePerHour: 400,
    minHours: 3,
    availability: 'Available',
    amenities: ['Full Bar', 'Lounge Seating', 'Dance Floor', 'Catering Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1561912774-79769a0a0a7a?q=80&w=2260&auto=format&fit=crop',
    ],
    address: '123 Main St, New York, NY',
  },
];

const EventSpacesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState(null);
  const [location, setLocation] = useState('New York');
  const [partySize, setPartySize] = useState(0);

  const handlePartySizeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setPartySize(isNaN(value) ? 0 : value);
  };

  const { data: eventSpaces = mockEventSpaces } = useQuery({
    queryKey: ['eventSpaces'],
    queryFn: async () => {
      return mockEventSpaces;
    }
  });

  const filteredEventSpaces = eventSpaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCapacity = capacityFilter === null || space.capacity >= capacityFilter;
    
    return matchesSearch && matchesCapacity;
  });

  const handleCapacityChange = (capacity) => {
    setCapacityFilter(capacity);
  };

  return (
    <AppTheme>
      <CssBaseline />
      <Layout>
        <Stack direction="column" spacing={2}>
          <Box sx={{ bgcolor: 'primary.light', py: 6 }}>
            <Container maxWidth="lg">
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Find the Perfect Event Space
                </Typography>
              </Stack>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Looking for a venue for your next special occasion? Browse our collection of event spaces available for booking.
                </Typography>
              </Box>
              
              <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    placeholder="Search by venue name, features or restaurant..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={20} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
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
                  label="All Sizes"
                  onClick={() => setCapacityFilter(null)}
                  color={capacityFilter === null ? "primary" : "default"}
                  variant={capacityFilter === null ? "filled" : "outlined"}
                  sx={{ borderRadius: '20px' }}
                />
                {[50, 100, 150, 200, 250, 300].map((capacity) => (
                  <Chip
                    key={capacity}
                    label={`${capacity}+ People`}
                    onClick={() => setCapacityFilter(capacity)}
                    color={capacityFilter === capacity ? "primary" : "default"}
                    variant={capacityFilter === capacity ? "filled" : "outlined"}
                    sx={{ borderRadius: '20px' }}
                  />
                ))}
              </Box>
            </Container>
          </Box>

          <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 'medium' }}>
              {filteredEventSpaces.length} Event Spaces Found in {location}
            </Typography>

            <Grid container spacing={4}>
              {filteredEventSpaces.map(space => (
                <Grid item xs={12} lg={6} key={space.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) => theme.shadows[4],
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 256 }}>
                      <CardMedia
                        component="img"
                        height="256"
                        image={space.images[0]}
                        alt={space.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      {space.availability === 'Booked' && (
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="h5" color="white" fontWeight="bold">
                            Currently Booked
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                            {space.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {space.restaurantName}
                          </Typography>
                        </Box>
                        <Chip
                          label={space.availability}
                          color={space.availability === 'Available' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>

                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {space.description}
                      </Typography>

                      <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                          <Users size={16} style={{ marginRight: 8 }} />
                          <Typography variant="body2">
                            Up to {space.capacity} people
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                          <MapPin size={16} style={{ marginRight: 8 }} />
                          <Typography variant="body2">
                            {space.address}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {space.amenities.map((amenity, index) => (
                          <Chip
                            key={index}
                            label={amenity}
                            size="small"
                            sx={{ 
                              bgcolor: 'primary.light',
                              color: 'primary.dark',
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                      <Button
                        component={Link}
                        to={`/event-spaces/${space.id}`}
                        variant="outlined"
                        fullWidth
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        component={Link}
                        to={`/event-spaces/${space.id}/book`}
                        variant="contained"
                        fullWidth
                        disabled={space.availability === 'Booked'}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                        }}
                      >
                        Book Now
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {filteredEventSpaces.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No event spaces found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try adjusting your filters or search term.
                </Typography>
              </Box>
            )}
          </Container>
        </Stack>
      </Layout>
    </AppTheme>
  );
};

export default EventSpacesPage;
