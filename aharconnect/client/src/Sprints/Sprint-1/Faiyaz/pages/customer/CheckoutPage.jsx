import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useCart } from '../../context/CartContext';
import { initiatePayment } from '../../../../../services/paymentService';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  Grid,
  TextField,
  Stack,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Chip,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalShipping, ShoppingCart, Payment, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const steps = ['Cart Review', 'Delivery Details', 'Payment'];

const CheckoutPage = () => {
  const { items, totalItems, totalAmount, removeItem } = useCart();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    instructions: ''
  });

  // Add logging for cart state
  React.useEffect(() => {
    console.log('[CheckoutPage] Cart state:', {
      items,
      totalItems,
      totalAmount
    });
  }, [items, totalItems, totalAmount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.menuItem?.price || 0) * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    console.log('[CheckoutPage] Starting order placement:', {
      items,
      totalItems,
      totalAmount,
      formData
    });

    if (items.length === 0) {
      console.error('[CheckoutPage] Cannot place order: Cart is empty');
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      // Create order data
      const orderData = {
        items: items.map(item => ({
          menuItem: item.menuItem._id,
          quantity: item.quantity,
          price: item.menuItem.price
        })),
        totalAmount,
        deliveryAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        specialInstructions: formData.instructions
      };

      console.log('[CheckoutPage] Order data prepared:', orderData);

      // Get auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Create order in backend with auth token
      const orderResponse = await axios.post(`${API_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('[CheckoutPage] Order created:', orderResponse.data);

      // Initiate payment with the order ID
      await initiatePayment(orderResponse.data._id);
      
      // The server will handle the redirect to the payment gateway
      // No need to handle the redirect here as the server will do it
      
    } catch (error) {
      console.error('[CheckoutPage] Error placing order:', error);
      toast.error(error.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = 2.99;
  const tax = subtotal * 0.1;
  const total = subtotal + deliveryFee + tax;

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={3}>
          {/* Order Summary */}
          <Grid item xs={12} md={8}>
            <StyledPaper>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCart sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Order Summary
                </Typography>
                <Chip 
                  label={`${totalItems} items`} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 2 }}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              
              {Array.isArray(items) && items.length > 0 ? (
                <Stack spacing={2}>
                  {items.map(item => (
                    <Box 
                      key={item.menuItem?._id || Math.random()} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Box>
                          <Typography variant="body1">
                            <Box component="span" sx={{ fontWeight: 'medium' }}>
                              {item.quantity} x{' '}
                            </Box>
                            {item.menuItem?.item_name || 'Unknown'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${item.menuItem?.price?.toFixed(2) || '0.00'} each
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 'medium', ml: 'auto' }}>
                          ${item.menuItem?.price ? (item.menuItem.price * item.quantity).toFixed(2) : '0.00'}
                        </Typography>
                        <IconButton 
                          onClick={() => removeItem(item.menuItem._id)}
                          color="error"
                          size="small"
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Your cart is empty. <Button color="primary" onClick={() => navigate('/restaurants')}>Browse Restaurants</Button>
                </Alert>
              )}
            </StyledPaper>

            {/* Delivery Information */}
            <StyledPaper>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShipping sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Delivery Information
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Delivery Address"
                    name="address"
                    multiline
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Special Instructions"
                    name="instructions"
                    multiline
                    rows={3}
                    value={formData.instructions}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </StyledPaper>

            {/* Payment Section */}
            <StyledPaper>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Payment sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Payment
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Total Amount: ${total.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  You will be redirected to our secure payment gateway (SSLCommerz)
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePlaceOrder}
                  disabled={loading || !items.length}
                  startIcon={<Payment />}
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </Box>
            </StyledPaper>
          </Grid>

          {/* Order Total */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ position: 'sticky', top: 24, p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Total
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Delivery Fee</Typography>
                  <Typography>${deliveryFee.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Tax (10%)</Typography>
                  <Typography>${tax.toFixed(2)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">
                    ${total.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={!items.length}
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default CheckoutPage;
