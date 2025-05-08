import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { MapPin, Utensils, Calendar, Users } from 'lucide-react';
import { Container, Typography, Box, Grid } from '@mui/material';

const Index = () => {
  return (
    <Layout>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: { xs: 4, md: 6 }
      }}>
        <Container maxWidth="lg" className="text-center">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to AharConnect
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}>
            Discover amazing restaurants, book tables, order food online, and plan events - all in one place.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/restaurants"
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: '#B48CF2',
                '&:hover': { bgcolor: '#9B6FE0' },
                color: 'white',
                fontWeight: 500,
                boxShadow: 1,
                '&:hover': { boxShadow: 2 }
              }}
            >
              Find Restaurants
            </Button>
            <Button
              component={Link}
              to="/events"
              variant="outlined"
              size="large"
            >
              Book Event Space
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Discover AharConnect Features
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  bgcolor: '#F3EAFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mb: 1 
                }}>
                  <MapPin sx={{ color: '#B48CF2', fontSize: 24 }} />
                </Box>
                <CardTitle>Find Nearby Restaurants</CardTitle>
                <CardDescription>Explore restaurants in your area with detailed information and reviews.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  component={Link}
                  to="/restaurants"
                  variant="contained"
                  fullWidth
                  sx={{ 
                    bgcolor: '#B48CF2',
                    '&:hover': { bgcolor: '#9B6FE0' },
                    color: 'white',
                    fontWeight: 500,
                    boxShadow: 1,
                    '&:hover': { boxShadow: 2 }
                  }}
                >
                  Explore Restaurants
                </Button>
              </CardFooter>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  bgcolor: '#F3EAFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mb: 1 
                }}>
                  <Utensils sx={{ color: '#B48CF2', fontSize: 24 }} />
                </Box>
                <CardTitle>Order Online</CardTitle>
                <CardDescription>Order your favorite meals for pickup or delivery from top restaurants.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  component={Link}
                  to="/restaurants"
                  variant="contained"
                  fullWidth
                  sx={{ 
                    bgcolor: '#B48CF2',
                    '&:hover': { bgcolor: '#9B6FE0' },
                    color: 'white',
                    fontWeight: 500,
                    boxShadow: 1,
                    '&:hover': { boxShadow: 2 }
                  }}
                >
                  Browse Menus
                </Button>
              </CardFooter>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  bgcolor: '#F3EAFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mb: 1 
                }}>
                  <Calendar sx={{ color: '#B48CF2', fontSize: 24 }} />
                </Box>
                <CardTitle>Table Reservations</CardTitle>
                <CardDescription>Book tables at your favorite restaurants and skip the wait.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  component={Link}
                  to="/restaurants"
                  variant="contained"
                  fullWidth
                  sx={{ 
                    bgcolor: '#B48CF2',
                    '&:hover': { bgcolor: '#9B6FE0' },
                    color: 'white',
                    fontWeight: 500,
                    boxShadow: 1,
                    '&:hover': { boxShadow: 2 }
                  }}
                >
                  Make Reservation
                </Button>
              </CardFooter>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  bgcolor: '#F3EAFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mb: 1 
                }}>
                  <Users sx={{ color: '#B48CF2', fontSize: 24 }} />
                </Box>
                <CardTitle>Event Spaces</CardTitle>
                <CardDescription>Find and book venues for parties, corporate events, and special occasions.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  component={Link}
                  to="/events"
                  variant="contained"
                  fullWidth
                  sx={{ 
                    bgcolor: '#B48CF2',
                    '&:hover': { bgcolor: '#9B6FE0' },
                    color: 'white',
                    fontWeight: 500,
                    boxShadow: 1,
                    '&:hover': { boxShadow: 2 }
                  }}
                >
                  Book Event Space
                </Button>
              </CardFooter>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: '#F3F6F9', py: { xs: 3, md: 4 } }}>
        <Container maxWidth="lg" className="text-center">
          <Typography variant="h3" component="h2" gutterBottom>
            Are you a restaurant owner?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: '800px', mx: 'auto', mb: 3 }}>
            Join AharConnect and boost your restaurant's visibility. Manage reservations, online orders, and events all in one place.
          </Typography>
          <Button
            component={Link}
            to="/restaurant-dashboard"
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: '#B48CF2',
              '&:hover': { bgcolor: '#9B6FE0' },
              color: 'white',
              fontWeight: 500,
              boxShadow: 1,
              '&:hover': { boxShadow: 2 }
            }}
          >
            Restaurant Dashboard
          </Button>
        </Container>
      </Box>
    </Layout>
  );
};

export default Index;
