import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import API from '../../api/auth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'sonner';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
}));

const FoodieProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferences: []
  });

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await axios.get('/api/orders/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      return response.data;
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setProfile(response.data);
      setFormData(response.data);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to load profile';
      setError(errorMessage);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setProfile(response.data);
      setEditMode(false);
      setError('');
      toast.success('Profile updated successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating profile:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <StyledPaper>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto',
              mb: 2
            }}
            src={profile?.avatar}
          />
          <Typography variant="h4" gutterBottom>
            My Profile
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Order History
            </Typography>
            {ordersLoading ? (
              <Typography>Loading orders...</Typography>
            ) : (
              <List>
                {orders.map((order, index) => (
                  <React.Fragment key={order._id}>
                    <ListItem>
                      <ListItemText
                        primary={`Order #${order._id.substring(0, 8)}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {order.restaurantId?.name || 'Restaurant'}
                            </Typography>
                            {` — ${format(new Date(order.createdAt), 'PPp')}`}
                            <Box sx={{ mt: 1 }}>
                              <Chip
                                label={order.status.toUpperCase()}
                                color={
                                  order.status === 'delivered' ? 'success' :
                                  order.status === 'preparing' ? 'warning' :
                                  order.status === 'cancelled' ? 'error' : 'default'
                                }
                                size="small"
                                sx={{ mr: 1 }}
                              />
                              <Chip
                                label={`Payment: ${order.paymentStatus.toUpperCase()}`}
                                color={
                                  order.paymentStatus === 'completed' ? 'success' :
                                  order.paymentStatus === 'failed' ? 'error' : 'warning'
                                }
                                size="small"
                              />
                              <Box sx={{ mt: 1 }}>
                                {order.items.map((item, itemIndex) => (
                                  <Typography key={itemIndex} variant="body2" color="text.secondary">
                                    {item.quantity}x {item.menuItem?.item_name} - ${(item.price * item.quantity).toFixed(2)}
                                  </Typography>
                                ))}
                                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                  Total: ${order.totalAmount.toFixed(2)}
                                </Typography>
                              </Box>
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                    {index < orders.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                {orders.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No orders yet"
                      secondary="Your order history will appear here"
                    />
                  </ListItem>
                )}
              </List>
            )}
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {editMode ? (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);
                    setFormData(profile);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default FoodieProfile; 