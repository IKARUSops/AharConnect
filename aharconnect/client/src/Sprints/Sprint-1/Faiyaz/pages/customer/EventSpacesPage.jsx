import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Users, CalendarCheck, Filter, Search } from 'lucide-react';
import axios from 'axios';
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

  const { data: apiEventSpaces = [] } = useQuery({
    queryKey: ['eventSpaces'],
    queryFn: async () => {
      console.log('API call to /api/event-reservations/all initiated');
      try {
        const response = await axios.get('/api/event-reservations/all'); // Correct endpoint
        return response.data.map(space => ({
          ...space,
          eventRate: space.eventRate || 0 // Default to 0 if not provided
        }));
      } catch (error) {
        console.error('Error fetching event spaces:', error);
        return [];
      }
    }
  });

  console.log('Data received from API:', apiEventSpaces);

  const eventSpaces = [...apiEventSpaces];

  const filteredEventSpaces = eventSpaces.filter(space => {
    const matchesSearch = (space.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           space.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           space.restaurantName?.toLowerCase().includes(searchTerm.toLowerCase()));

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
            {filteredEventSpaces.map((space) => (
              <Grid item xs={12} md={6} lg={4} key={`${space.id}-${space.name}`}>
                <Card 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    height: '500px', // Fixed height for consistency
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 24px rgba(40, 16, 78, 0.12)'
                    },
                    opacity: space.availability === 'Not Available' ? 0.7 : 1,
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <CardMedia
                    component="img"
                    height="250" // Fixed image height
                    image={space.images && space.images.length > 0 ? space.images[0] : '/uploads/placeholder-image.jpg'}
                    alt={space.name}
                    sx={{
                      objectFit: 'cover'
                    }}
                  />
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '200px', // Fixed content height
                  }}>
                    <Typography gutterBottom variant="h5" component="h2" sx={{ 
                      color: '#28104E',
                      fontWeight: 600,
                      mb: 1,
                      fontSize: '1.25rem',
                      lineHeight: 1.2
                    }}>
                      {space.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ 
                      color: '#6237A0', 
                      mb: 2,
                      fontSize: '1rem'
                    }}>
                      {space.restaurantName}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 'auto',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontSize: '0.875rem',
                        lineHeight: 1.5
                      }}
                    >
                      {space.description}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ 
                      mb: 2,
                      flexWrap: 'wrap',
                      gap: 1,
                      mt: 'auto'
                    }}>
                      <Chip 
                        icon={<Users size={16} />} 
                        label={`${space.capacity} people`} 
                        size="small"
                        sx={{
                          bgcolor: 'rgba(151, 84, 203, 0.1)',
                          color: '#6237A0',
                          '& .MuiChip-icon': {
                            color: '#6237A0'
                          }
                        }}
                      />
                      <Chip 
                        icon={<MapPin size={16} />} 
                        label={space.address} 
                        size="small"
                        sx={{
                          bgcolor: 'rgba(151, 84, 203, 0.1)',
                          color: '#6237A0',
                          '& .MuiChip-icon': {
                            color: '#6237A0'
                          }
                        }}
                      />
                    </Stack>
                    <Typography variant="h6" sx={{ 
                      color: '#28104E', 
                      fontWeight: 600,
                      fontSize: '1.1rem'
                    }}>
                      ${space.pricePerHour}/hour
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#6237A0',
                      fontSize: '0.875rem',
                      mt: 1
                    }}>
                      Event Rate: ${space.eventRate}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ 
                    p: 3, 
                    pt: 0,
                    height: '50px' // Fixed actions height
                  }}>
                    <Button 
                      component={Link} 
                      to={`/events/book/${space.id}`}
                      variant="contained" 
                      fullWidth
                      disabled={space.availability === 'Not Available'}
                      sx={{
                        bgcolor: '#6237A0',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#9754CB'
                        },
                        '&.Mui-disabled': {
                          bgcolor: 'rgba(98, 55, 160, 0.3)'
                        },
                        borderRadius: '8px',
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      {space.availability === 'Not Available' ? 'Not Available' : 'Book Now'}
                    </Button>
                  </CardActions>
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
