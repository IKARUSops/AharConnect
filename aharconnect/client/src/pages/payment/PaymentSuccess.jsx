import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const transactionId = params.get('tran_id');

    if (status === 'VALID' && transactionId) {
      toast.success('Payment successful!');
    }
  }, [location]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <CheckCircle
            sx={{
              fontSize: 80,
              color: 'success.main',
              mb: 2,
            }}
          />
          <Typography variant="h4" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Thank you for your payment. Your order has been confirmed.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/restaurants')}
            >
              Continue Shopping
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/foodie-profile')}
            >
              View Orders
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PaymentSuccess; 