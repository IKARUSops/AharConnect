import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { toast } from 'sonner';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const transactionId = params.get('tran_id');

    if (status === 'CANCELLED' && transactionId) {
      toast.info('Payment was cancelled.');
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
          <Cancel
            sx={{
              fontSize: 80,
              color: 'warning.main',
              mb: 2,
            }}
          />
          <Typography variant="h4" gutterBottom>
            Payment Cancelled
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your payment was cancelled. You can try again when you're ready.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/checkout')}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/restaurants')}
            >
              Back to Restaurants
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PaymentCancel; 