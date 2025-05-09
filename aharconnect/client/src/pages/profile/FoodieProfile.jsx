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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/users/profile');
      setProfile(response.data);
      setFormData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load profile');
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
      await API.put('/users/profile', formData);
      setProfile(formData);
      setEditMode(false);
      setError('');
    } catch (err) {
      setError('Failed to update profile');
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
            <List>
              {profile?.orders?.map((order, index) => (
                <React.Fragment key={order.id}>
                  <ListItem>
                    <ListItemText
                      primary={`Order #${order.id}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {order.restaurant}
                          </Typography>
                          {` — ${order.date}`}
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={order.status}
                              color={
                                order.status === 'Delivered' ? 'success' :
                                order.status === 'Processing' ? 'warning' : 'default'
                              }
                              size="small"
                            />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              Total: ${order.total}
                            </Typography>
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  {index < profile.orders.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {(!profile?.orders || profile.orders.length === 0) && (
                <ListItem>
                  <ListItemText
                    primary="No orders yet"
                    secondary="Your order history will appear here"
                  />
                </ListItem>
              )}
            </List>
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