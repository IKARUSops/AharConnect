import React from 'react';
import Layout from '../../components/layout/Layout';
import { useCart } from '../../context/CartContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const CheckoutPage = () => {
  const { items, totalItems } = useCart();

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Checkout
        </Typography>

        <Grid container spacing={3}>
          {/* Order Summary */}
          <Grid item xs={12} md={8}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              {Array.isArray(items) && items.length > 0 ? (
                <Stack spacing={2}>
                  {items.map(item => (
                    <Box key={item.menuItem?.id || Math.random()} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1">
                          <Box component="span" sx={{ fontWeight: 'medium' }}>
                            {item.quantity} x{' '}
                          </Box>
                          {item.menuItem?.name || 'Unknown'}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        ${item.menuItem?.price ? (item.menuItem.price * item.quantity).toFixed(2) : '0.00'}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">
                  Your cart is empty.
                </Typography>
              )}
            </StyledPaper>

            {/* Delivery Information */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Delivery Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Delivery Address"
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
              </Grid>
            </StyledPaper>

            {/* Payment Information */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Payment Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    placeholder="MM/YY"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    required
                  />
                </Grid>
              </Grid>
            </StyledPaper>
          </Grid>

          {/* Order Total */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Total
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal</Typography>
                    <Typography>${items.reduce((total, item) => total + (item.menuItem?.price || 0) * item.quantity, 0).toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Delivery Fee</Typography>
                    <Typography>$2.99</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Tax</Typography>
                    <Typography>${(items.reduce((total, item) => total + (item.menuItem?.price || 0) * item.quantity, 0) * 0.1).toFixed(2)}</Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">
                    ${(items.reduce((total, item) => total + (item.menuItem?.price || 0) * item.quantity, 0) + 2.99 + 
                      items.reduce((total, item) => total + (item.menuItem?.price || 0) * item.quantity, 0) * 0.1).toFixed(2)}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={!items.length}
                >
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default CheckoutPage;
