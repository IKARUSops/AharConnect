import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import AppTheme from '../../../../../shared-theme/AppTheme';
import ColorModeSelect from '../../../../../shared-theme/ColorModeSelect';
import { Badge } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import axios from 'axios';

const RestaurantDetailPage = (props) => {
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      if (!id) {
        console.error("Restaurant user ID is undefined");
        throw new Error("Restaurant user ID is undefined");
      }
      const restaurant = await axios.get(`http://localhost:5000/api/restaurants/user/${id}`);
      if (!restaurant) throw new Error('Restaurant not found');
      return restaurant.data;
    },
    enabled: !!id,
  });

  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['menu', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/inventory/menu/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching menu items:', error);
        return [];
      }
    },
    enabled: !!id,
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!id) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <Stack
          direction="column"
          component="main"
          sx={{ justifyContent: 'center', height: '100%', textAlign: 'center' }}
        >
          <h1>Restaurant ID is missing. Please check the URL.</h1>
        </Stack>
      </AppTheme>
    );
  }

  const menuItemsArray = Array.isArray(menuItems) ? menuItems : [];
  const categories = ['all', ...Array.from(new Set(menuItemsArray.map(item => item.category)))];

  const filteredMenuItems = menuItemsArray.filter(item => {
    const name = typeof item.item_name === 'string' ? item.item_name.toLowerCase() : '';
    const description = typeof item.description === 'string' ? item.description.toLowerCase() : '';
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedMenuItems = categories.map(category => ({
    category,
    items: menuItemsArray.filter(item => item.category === category),
  }));

  if (restaurantLoading) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <Stack
          direction="column"
          component="main"
          sx={{ justifyContent: 'center', height: '100%' }}
        >
          <div className="container py-5">
            <div className="text-center">
              <h1>Loading...</h1>
            </div>
          </div>
        </Stack>
      </AppTheme>
    );
  }

  if (!restaurant) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <Stack
          direction="column"
          component="main"
          sx={{ justifyContent: 'center', height: '100%' }}
        >
          <div className="container py-5">
            <div className="text-center">
              <h1>Restaurant Not Found</h1>
              <p>The restaurant you're looking for doesn't exist or may have been removed.</p>
              <Button variant="contained" color="primary" component={Link} to="/restaurants">
                Back to Restaurants
              </Button>
            </div>
          </div>
        </Stack>
      </AppTheme>
    );
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Stack
        direction="column"
        component="main"
        sx={{ justifyContent: 'center', height: '100%' }}
      >
        <div className="container py-5">
          <div className="mb-4">
            <img
              src={restaurant.image || 'https://via.placeholder.com/800x400'}
              alt={restaurant.name}
              className="img-fluid rounded"
            />
          </div>
          <h1 className="display-4 mb-3">{restaurant.name}</h1>
          <p className="lead">{restaurant.address}</p>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {restaurant.cuisineType?.map((cuisine, index) => (
              <Badge key={index} color="primary" variant="outlined" style={{ color: 'var(--bs-vibrant-purple, #9754CB)', borderColor: 'var(--bs-vibrant-purple, #9754CB)' }}>
                {cuisine}
              </Badge>
            ))}
          </div>

          <Tabs value={tabValue} onChange={handleTabChange} aria-label="restaurant tabs">
            <Tab label="Menu" />
            <Tab label="Info" />
            <Tab label="Reviews" />
          </Tabs>

          {tabValue === 0 && (
            <div className="mt-4">
              <TextField
                label="Search menu items"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="d-flex flex-wrap gap-2 mt-3">
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    variant={activeCategory === category ? 'contained' : 'outlined'}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              {groupedMenuItems.map(group => (
                group.items.length > 0 && (
                  <Card key={group.category} className="mt-4 p-3">
                    <h3>{group.category}</h3>
                    <div className="row">
                      {group.items.map(item => (
                        <div key={item._id} className="col-md-4">
                          <Card className="p-3 mb-3" style={{ backgroundColor: 'var(--bs-light-lavender, #DEACFS)', borderColor: 'var(--bs-vibrant-purple, #9754CB)', transition: 'transform 0.2s', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.item_name}
                                className="img-fluid rounded mb-2"
                              />
                            )}
                            <h5>{item.item_name}</h5>
                            <p className="text-muted" style={{ color: 'var(--bs-body-color, #6c757d)' }}>{item.description}</p>
                            <p className="fw-bold">${item.price}</p>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              ))}
            </div>
          )}

          {tabValue === 1 && (
            <Card className="mt-4 p-3">
              <h3>About {restaurant.name}</h3>
              <p>{restaurant.description}</p>
              <Divider className="my-3" />
              <h4>Hours of Operation</h4>
              <p>{restaurant.openingHours.opening} - {restaurant.openingHours.closing}, Daily</p>
              <Divider className="my-3" />
              <h4>Contact Information</h4>
              <p>Phone: {restaurant.phoneNumber}</p>
              <p>Email: {restaurant.email}</p>
              <Divider className="my-3" />
              <h4>Address</h4>
              <p>{restaurant.address}</p>
            </Card>
          )}

          {tabValue === 2 && (
            <Card className="mt-4 p-3 text-center">
              <h3>Reviews Coming Soon</h3>
              <p>We're working on gathering reviews for this restaurant. Check back later!</p>
            </Card>
          )}
        </div>
      </Stack>
    </AppTheme>
  );
};

export default RestaurantDetailPage;
