import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Alert,
  Switch,
  FormControlLabel,
  TextField
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  MenuBook as MenuBookIcon,
  EventSeat as EventSeatIcon,
  Assessment as AssessmentIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MenuDashboard from '../../Sprint-1/Menu/Menuedit';
import ExpenseTrackingDashboard from '../../Sprint-1/Expenses/expenses_entry';
import EditProfileDialog from './EditProfileDialog';
import API from '../../../api/auth';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservationSettings, setReservationSettings] = useState(null);
  const [eventRate, setEventRate] = useState('');

  // Mock data for when no profile exists
  const mockData = {
    name: "Your Restaurant",
    rating: 0,
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    popularItems: [],
    recentOrders: [],
  };

  useEffect(() => {
    fetchRestaurantProfile();
  }, []);

  const fetchRestaurantProfile = async () => {
    try {
      const response = await API.get('/restaurants/profile');
      setProfileData(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching restaurant profile:', error);
      setError('Failed to fetch restaurant profile');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileDialogOpen = () => {
    setOpenProfileDialog(true);
  };

  const handleProfileDialogClose = () => {
    setOpenProfileDialog(false);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfileData(updatedProfile);
    setOpenProfileDialog(false);
  };

  const handleReservationToggle = async () => {
    try {
      const response = await API.post('/reservations/toggle');
      setReservationSettings(response.data);
    } catch (error) {
      console.error('Error toggling reservations:', error);
      setError('Failed to toggle reservations');
    }
  };

  useEffect(() => {
    const fetchReservationSettings = async () => {
      try {
        const response = await API.get('/reservations/settings');
        setReservationSettings(response.data);
      } catch (error) {
        console.error('Error fetching reservation settings:', error);
      }
    };

    fetchReservationSettings();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {profileData?.name || mockData.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {profileData ? "Here's what's happening with your restaurant today" : "Set up your restaurant profile to get started"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={profileData ? <EditIcon /> : <AddIcon />}
          onClick={handleProfileDialogOpen}
        >
          {profileData ? 'Edit Profile' : 'Create Profile'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Profile Edit Dialog */}
      <EditProfileDialog
        open={openProfileDialog}
        onClose={handleProfileDialogClose}
        initialData={profileData}
        onSuccess={handleProfileUpdate}
      />

      {/* Reservation Settings Card */}
      <Card sx={{ mb: 4 }}>
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

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ReceiptIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Orders</Typography>
              </Box>
              <Typography variant="h4">{profileData?.totalOrders || mockData.totalOrders}</Typography>
              <Typography variant="body2" color="text.secondary">
                All time orders
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Orders</Typography>
              </Box>
              <Typography variant="h4">{profileData?.activeOrders || mockData.activeOrders}</Typography>
              <Typography variant="body2" color="text.secondary">
                Current orders
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WalletIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Revenue</Typography>
              </Box>
              <Typography variant="h4">${profileData?.totalRevenue || mockData.totalRevenue}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total revenue
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Rating</Typography>
              </Box>
              <Typography variant="h4">{profileData?.rating || mockData.rating}</Typography>
              <Typography variant="body2" color="text.secondary">
                Customer rating
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Activity Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="restaurant activities">
          <Tab icon={<ReceiptIcon />} label="Orders" />
          <Tab icon={<MenuBookIcon />} label="Menu" />
          <Tab icon={<WalletIcon />} label="Expenses" />
          <Tab icon={<EventSeatIcon />} label="Reservations" />
          <Tab icon={<AssessmentIcon />} label="Analytics" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            {profileData?.recentOrders?.length > 0 ? (
              <List>
                {profileData.recentOrders.map((order, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Order #${order.id}`}
                      secondary={`${order.customer} - $${order.amount}`}
                    />
                    <Typography
                      variant="body2"
                      color={
                        order.status === 'Delivered'
                          ? 'success.main'
                          : order.status === 'Preparing'
                          ? 'warning.main'
                          : 'info.main'
                      }
                    >
                      {order.status}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                No orders yet. They will appear here when you start receiving orders.
              </Typography>
            )}
          </StyledPaper>
        )}
        {activeTab === 1 && <MenuDashboard />}
        {activeTab === 2 && <ExpenseTrackingDashboard />}
        {activeTab === 3 && (
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Reservations
            </Typography>
            <Typography color="text.secondary">
              Reservation management coming soon.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Update Event Rates
              </Typography>
              <TextField
                label="Event Rate ($/hour)"
                type="number"
                variant="outlined"
                value={eventRate}
                onChange={(e) => setEventRate(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('authToken');
                    const response = await axios.put('/api/reservations/settings', {
                      eventRate
                    }, {
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                    });
                    console.log('Event rates updated successfully:', response.data);
                  } catch (error) {
                    console.error('Error updating event rates:', error);
                  }
                }}
              >
                Update Events
              </Button>
            </Box>
          </StyledPaper>
        )}
        {activeTab === 4 && (
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Analytics
            </Typography>
            <Typography color="text.secondary">
              Analytics dashboard coming soon.
            </Typography>
          </StyledPaper>
        )}
      </Box>
    </Container>
  );
};

export default RestaurantDashboard; 