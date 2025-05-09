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
  Grid,
  useTheme
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
  const theme = useTheme();
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
            backgroundImage: 'url("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80")',
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
              Find Your Perfect Event Space
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
              Discover unique venues for your special occasions and corporate events
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
                  placeholder="Search by venue name, features or restaurant..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
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
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                {location}
              </Typography>
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
                label="All Sizes"
                onClick={() => setCapacityFilter(null)}
                color={capacityFilter === null ? "primary" : "default"}
                variant={capacityFilter === null ? "filled" : "outlined"}
                sx={{ 
                  borderRadius: '20px',
                  bgcolor: capacityFilter === null ? 'primary.main' : 'rgba(255,255,255,0.9)',
                  '&:hover': {
                    bgcolor: capacityFilter === null ? 'primary.dark' : 'rgba(255,255,255,1)',
                  }
                }}
              />
              {[50, 100, 150, 200, 250, 300].map((capacity) => (
                <Chip
                  key={capacity}
                  label={`${capacity}+ People`}
                  onClick={() => setCapacityFilter(capacity)}
                  color={capacityFilter === capacity ? "primary" : "default"}
                  variant={capacityFilter === capacity ? "filled" : "outlined"}
                  sx={{ 
                    borderRadius: '20px',
                    bgcolor: capacityFilter === capacity ? 'primary.main' : 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      bgcolor: capacityFilter === capacity ? 'primary.dark' : 'rgba(255,255,255,1)',
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
                    transition: 'all 0.3s ease',
                    bgcolor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: (theme) => theme.shadows[8],
                      '& .MuiCardMedia-root': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', height: 280, overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="280"
                      image={space.images[0]}
                      alt={space.name}
                      sx={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
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
                          backdropFilter: 'blur(4px)',
                          WebkitBackdropFilter: 'blur(4px)',
                        }}
                      >
                        <Typography variant="h5" color="white" fontWeight="bold">
                          Currently Booked
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      <Chip
                        label={space.availability}
                        color={space.availability === 'Available' ? 'success' : 'error'}
                        size="small"
                        sx={{
                          bgcolor: space.availability === 'Available' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                          color: 'white',
                          fontWeight: 600,
                          backdropFilter: 'blur(4px)',
                          WebkitBackdropFilter: 'blur(4px)',
                        }}
                      />
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {space.name}
                      </Typography>
                      <Typography 
                        variant="subtitle1" 
                        color="text.secondary"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <MapPin size={16} />
                        {space.restaurantName}
                      </Typography>
                    </Box>

                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      paragraph
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 2,
                      }}
                    >
                      {space.description}
                    </Typography>

                    <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Users size={20} />
                        <Typography variant="body2" color="text.secondary">
                          Up to {space.capacity} people
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarCheck size={20} />
                        <Typography variant="body2" color="text.secondary">
                          Min. {space.minHours} hours
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                      {space.amenities.slice(0, 3).map((amenity, index) => (
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
                      {space.amenities.length > 3 && (
                        <Chip
                          label={`+${space.amenities.length - 3} more`}
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
                      )}
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 'auto',
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                    }}>
                      <Typography 
                        variant="h6" 
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      >
                        ${space.pricePerHour}/hour
                      </Typography>
                      <Button
                        component={Link}
                        to={`/events/book/${space.id}`}
                        variant="contained"
                        color="primary"
                        disabled={space.availability === 'Booked'}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          textTransform: 'none',
                          fontWeight: 600,
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          '&:hover': {
                            boxShadow: '0 6px 8px rgba(0,0,0,0.2)',
                          },
                        }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredEventSpaces.length === 0 && (
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
                No event spaces found
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

export default EventSpacesPage;
