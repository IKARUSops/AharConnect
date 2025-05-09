import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Divider
} from '@mui/material';

const RestaurantDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [reservationSettings, setReservationSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurant profile
        const profileResponse = await axios.get('/api/restaurants/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfile(profileResponse.data);

        // Fetch reservation settings
        const reservationResponse = await axios.get('/api/reservations/settings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setReservationSettings(reservationResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReservationToggle = async () => {
    try {
      const response = await axios.post('/api/reservations/toggle', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReservationSettings(response.data);
    } catch (error) {
      console.error('Error toggling reservations:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Restaurant Profile Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Restaurant Profile
              </Typography>
              {profile && (
                <>
                  <Typography variant="h6">{profile.name}</Typography>
                  <Typography color="textSecondary">{profile.description}</Typography>
                  <Typography>Address: {profile.address}</Typography>
                  <Typography>Phone: {profile.phone}</Typography>
                  <Typography>Email: {profile.email}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Reservation Settings Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Reservation Settings
              </Typography>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={reservationSettings?.isEnabled ?? false}
                      onChange={handleReservationToggle}
                      color="primary"
                    />
                  }
                  label="Enable Reservations"
                />
                {reservationSettings && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Max Capacity: {reservationSettings.maxCapacity} people
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Booking Duration: {reservationSettings.bookingDuration} minutes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Advance Booking: {reservationSettings.advanceBookingDays} days
                    </Typography>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Dashboard Sections */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Quick Stats
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">Total Orders</Typography>
                  <Typography>0</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">Today's Revenue</Typography>
                  <Typography>$0</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">Active Reservations</Typography>
                  <Typography>0</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantDashboard; 