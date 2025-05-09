import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Button, TextField, MenuItem, FormControl, InputLabel, Select, Typography, Switch, FormControlLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import AppTheme from '../../../shared-theme/AppTheme';
import ColorModeSelect from '../../../shared-theme/ColorModeSelect';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const MenuDashboard = () => {
  const [items, setItems] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({ item_name: '', category: '', price: '', description: '', item_status: 'available' });
  const [editId, setEditId] = useState(null);
  const categories = ['Cocktails', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];

  const token = localStorage.getItem('authToken');
  let restaurantId = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    restaurantId = decodedToken.id;
  } else {
    console.error('No token found in localStorage');
  }

  useEffect(() => {
    if (restaurantId) {
      fetchItems();
    }
  }, [restaurantId]);

  const fetchItems = async () => {
    console.log('Fetching items for restaurantId:', restaurantId); // Log the restaurantId
    try {
      const response = await axios.get(`http://localhost:5000/api/inventory/menu/${restaurantId}`);
      setItems(response.data.map(item => ({ id: item._id, ...item })));
    } catch (error) {
      console.error('Error fetching items:', error); // Log the error
    }
  };

  useEffect(() => {
  }, [items]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e) => {
    setFormData({ ...formData, item_status: e.target.checked ? 'available' : 'out of stock' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 800; // Industry standard width for restaurant app images
          const maxHeight = 600; // Industry standard height for restaurant app images
          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const resizedImage = canvas.toDataURL('image/jpeg');
          setFormData({ ...formData, image: resizedImage });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `http://localhost:5000/api/inventory/${editId}` : 'http://localhost:5000/api/inventory';
    const method = editId ? 'put' : 'post';
    const payload = { ...formData, restaurant_id: restaurantId };

    // Debugging: Log the payload being sent
    console.log('Payload being sent:', payload);

    await axios[method](url, payload);
    setOpenForm(false);
    setEditId(null);
    setFormData({ item_name: '', category: '', price: '', description: '', item_status: 'available' });
    fetchItems();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/inventory/${id}`);
    fetchItems();
  };

  const handleEdit = (id) => {
    const item = items.find(item => item.id === id);
    setFormData(item);
    setEditId(id);
    setOpenForm(true);
  };

  const columns = [
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'price', headerName: 'Price (SAR)', width: 120, renderCell: (params) => `${params.value} SAR` },
    { field: 'description', headerName: 'Description', width: 150 },
    { field: 'item_status', headerName: 'Status', width: 120 },
    { field: 'image', headerName: 'Image', width: 150, renderCell: (params) => (
      <img
        src={params.value}
        alt={params.row.item_name}
        style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
      />
    ) },
    { field: 'actions', headerName: 'Actions', width: 200, renderCell: (params) => (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEdit(params.row.id)}
          style={{ marginRight: 10, border: '1px solid black' }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(params.row.id)}
          style={{ border: '1px solid black' }}
        >
          Delete
        </Button>
      </>
    ) },
  ];

  const groupedItems = categories.map(category => ({
    category,
    items: items.filter(item => item.category === category),
  }));

  const pageSizeOptions = [5, 10, 20, 100]; // Add 100 to pageSizeOptions

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: 'center',
            height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
            marginTop: 'max(40px - var(--template-frame-height, 0px), 0px)',
            minHeight: '100%',
          },
          (theme) => ({
            '&::before': {
              content: '""',
              display: 'block',
              position: 'fixed',
              zIndex: -1,
              inset: 0,
              backgroundImage:
                'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
              backgroundRepeat: 'no-repeat',
              ...theme.applyStyles('dark', {
                backgroundImage:
                  'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
                  backgroundAttachment: 'fixed',
              }),
            },
          }),
        ]}
      >
        <Container>
          <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
            Menu Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenForm(true);
              setEditId(null);
              setFormData({ item_name: '', category: '', price: '', description: '', item_status: 'available' });
            }}
            sx={{ mb: 3 }}
          >
            Add Item
          </Button>
          {openForm && (
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="item_name"
                      label="Item Name"
                      value={formData.item_name}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="price"
                      label="Price (SAR)"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        label="Category"
                        required
                      >
                        {categories.map(cat => (
                          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.item_status === 'available'}
                          onChange={handleStatusChange}
                          color="primary"
                        />
                      }
                      label="Item Status"
                      labelPlacement="start"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="description"
                      label="Description"
                      value={formData.description}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="image"
                      label="Image URL"
                      value={formData.image}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                      Save
                    </Button>
                    <Button variant="outlined" onClick={() => setOpenForm(false)}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          )}
          {groupedItems.map(group => (
            group.items.length > 0 && (
              <div key={group.category}>
                <Typography variant="h5" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
                  {group.category}
                </Typography>
                <Paper elevation={2} sx={{ height: 400, width: '100%', mb: 3, borderRadius: 2 }}>
                  <DataGrid
                    rows={group.items}
                    columns={columns}
                    pageSizeOptions={pageSizeOptions}
                    pagination
                    sx={{ border: 0 }}
                  />
                </Paper>
              </div>
            )
          ))}
        </Container>
      </Stack>
    </AppTheme>
  );
};

export default MenuDashboard;