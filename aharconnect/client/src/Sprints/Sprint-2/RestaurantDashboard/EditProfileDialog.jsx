import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import API from '../../../api/auth';

const EditProfileDialog = ({ open, onClose, initialData, onSuccess }) => {
  const [profileData, setProfileData] = useState(initialData || {
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    openingHours: {
      opening: '',
      closing: '',
    },
    cuisine: [],
    capacity: 0,
    image: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put('/restaurants/profile', profileData);
      onSuccess(response.data);
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await API.post('/menu', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfileData(prev => ({
        ...prev,
        image: response.data.imagePath
      }));
      setSuccess('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Restaurant Profile</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <TextField
              fullWidth
              label="Restaurant Name"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              required
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={profileData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              required
            />

            <TextField
              fullWidth
              label="Address"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              required
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleInputChange}
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Opening Time"
                  name="openingHours.opening"
                  type="time"
                  value={profileData.openingHours.opening}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Closing Time"
                  name="openingHours.closing"
                  type="time"
                  value={profileData.openingHours.closing}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              type="number"
              value={profileData.capacity}
              onChange={handleInputChange}
              required
            />

            <FormControl fullWidth>
              <InputLabel>Cuisine Type</InputLabel>
              <Select
                multiple
                name="cuisine"
                value={profileData.cuisine}
                onChange={handleInputChange}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="Italian">Italian</MenuItem>
                <MenuItem value="Chinese">Chinese</MenuItem>
                <MenuItem value="Japanese">Japanese</MenuItem>
                <MenuItem value="Indian">Indian</MenuItem>
                <MenuItem value="Mexican">Mexican</MenuItem>
                <MenuItem value="American">American</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <input
                accept="image/*"
                type="file"
                id="restaurant-image-upload"
                hidden
                onChange={handleImageUpload}
              />
              <label htmlFor="restaurant-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                >
                  Upload Restaurant Image
                </Button>
              </label>
              {profileData.image && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={profileData.image}
                    alt="Restaurant"
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog; 