import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Chip,
  Divider,
  TextField,
  IconButton,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Star,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import AppTheme from '../../../shared-theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import ColorModeSelect from '../../../shared-theme/ColorModeSelect';

// ... existing styled components ...

export default function RestaurantDetailPage(props) {
  // ... existing state and hooks ...

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : restaurant ? (
        <>
          {/* Restaurant Header */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {restaurant.name}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Rating value={restaurant.rating} readOnly precision={0.5} />
                  <Typography variant="body2" color="text.secondary">
                    ({restaurant.reviews} reviews)
                  </Typography>
                  <Chip
                    label={restaurant.cuisine}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={restaurant.priceRange}
                    color="secondary"
                    variant="outlined"
                    size="small"
                  />
                </Stack>
                <Typography variant="body1" paragraph>
                  {restaurant.description}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <IconButton
                    color={isFavorite ? 'primary' : 'default'}
                    onClick={handleToggleFavorite}
                  >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <IconButton onClick={handleShare}>
                    <ShareIcon />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* Restaurant Images */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              {restaurant.images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={image}
                      alt={`${restaurant.name} - Image ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Restaurant Info */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Restaurant Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ mr: 1 }} />
                        <Typography variant="body1">{restaurant.address}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone sx={{ mr: 1 }} />
                        <Typography variant="body1">{restaurant.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Email sx={{ mr: 1 }} />
                        <Typography variant="body1">{restaurant.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ mr: 1 }} />
                        <Typography variant="body1">{restaurant.hours}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Actions
                    </Typography>
                    <Stack spacing={2}>
                      <Button
                        variant="contained"
                        startIcon={<CartIcon />}
                        onClick={handleOrderNow}
                        fullWidth
                      >
                        Order Now
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleMakeReservation}
                        fullWidth
                      >
                        Make Reservation
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Menu Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Menu
            </Typography>
            <Grid container spacing={3}>
              {restaurant.menu.map((category) => (
                <Grid item xs={12} key={category.name}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {category.name}
                      </Typography>
                      <Grid container spacing={2}>
                        {category.items.map((item) => (
                          <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <MenuItemCard
                              item={item}
                              onAddToCart={() => handleAddToCart(item)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Reviews Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Reviews
            </Typography>
            <Stack spacing={3}>
              {restaurant.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1">{review.author}</Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {review.date}
                    </Typography>
                    <Typography variant="body1">{review.content}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* Reservation Dialog */}
          <Dialog open={openReservationDialog} onClose={handleCloseReservationDialog}>
            <DialogTitle>Make a Reservation</DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField
                  label="Date"
                  type="date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Time"
                  type="time"
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Number of Guests"
                  type="number"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Special Requests"
                  multiline
                  rows={4}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  fullWidth
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseReservationDialog}>Cancel</Button>
              <Button onClick={handleSubmitReservation} variant="contained">
                Submit Reservation
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Restaurant not found
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/restaurants')}
            sx={{ mt: 2 }}
          >
            Back to Restaurants
          </Button>
        </Box>
      )}
    </Container>
  );
} 