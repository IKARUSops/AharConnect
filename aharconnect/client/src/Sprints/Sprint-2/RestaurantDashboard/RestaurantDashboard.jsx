import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  People as PeopleIcon,
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

  // Mock data - replace with actual data from your backend
  const restaurantData = {
    name: "Gourmet Delight",
    rating: 4.5,
    totalOrders: 156,
    activeOrders: 8,
    totalRevenue: 12500,
    popularItems: [
      { name: "Signature Pasta", orders: 45 },
      { name: "Grilled Salmon", orders: 38 },
      { name: "Chocolate Cake", orders: 32 },
    ],
    recentOrders: [
      { id: 1, customer: "John Doe", amount: 45.99, status: "Preparing" },
      { id: 2, customer: "Jane Smith", amount: 32.50, status: "Ready for Pickup" },
      { id: 3, customer: "Mike Johnson", amount: 28.75, status: "Delivered" },
    ],
  };

  useEffect(() => {
    fetchRestaurantProfile();
  }, []);

  const fetchRestaurantProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurants/profile');
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching restaurant profile:', error);
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
  };

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
            Welcome back, {profileData?.name || restaurantData.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's what's happening with your restaurant today
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleProfileDialogOpen}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Profile Edit Dialog */}
      <EditProfileDialog
        open={openProfileDialog}
        onClose={handleProfileDialogClose}
        initialData={profileData}
        onSuccess={handleProfileUpdate}
      />

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RestaurantIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Orders</Typography>
              </Box>
              <Typography variant="h4">{restaurantData.totalOrders}</Typography>
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
                <ReceiptIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Orders</Typography>
              </Box>
              <Typography variant="h4">{restaurantData.activeOrders}</Typography>
              <Typography variant="body2" color="text.secondary">
                Currently processing
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Revenue</Typography>
              </Box>
              <Typography variant="h4">${restaurantData.totalRevenue}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total earnings
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
              <Typography variant="h4">{restaurantData.rating}</Typography>
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
      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && (
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Orders</Typography>
              <Button size="small" endIcon={<PeopleIcon />}>
                View All Orders
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {restaurantData.recentOrders.map((order) => (
                <ListItem key={order.id}>
                  <ListItemIcon>
                    <ReceiptIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Order #${order.id} - ${order.customer}`}
                    secondary={`$${order.amount} - ${order.status}`}
                  />
                  <Button size="small" variant="outlined">
                    View Details
                  </Button>
                </ListItem>
              ))}
            </List>
          </StyledPaper>
        )}

        {activeTab === 1 && (
          <StyledPaper>
            <MenuDashboard />
          </StyledPaper>
        )}

        {activeTab === 2 && (
          <StyledPaper>
            <ExpenseTrackingDashboard />
          </StyledPaper>
        )}

        {activeTab === 3 && (
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Reservations</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {/* Handle add reservation */}}
              >
                New Reservation
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary" align="center">
              No active reservations at the moment
            </Typography>
          </StyledPaper>
        )}

        {activeTab === 4 && (
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Analytics</Typography>
              <Button
                variant="outlined"
                startIcon={<TrendingUpIcon />}
                onClick={() => {/* Handle view detailed analytics */}}
              >
                View Detailed Report
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Popular Items
                    </Typography>
                    <List>
                      {restaurantData.popularItems.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={item.name}
                            secondary={`${item.orders} orders`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Revenue Overview
                    </Typography>
                    <Typography variant="h4" color="primary">
                      ${restaurantData.totalRevenue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total revenue to date
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </StyledPaper>
        )}
      </Box>
    </Container>
  );
};

export default RestaurantDashboard; 