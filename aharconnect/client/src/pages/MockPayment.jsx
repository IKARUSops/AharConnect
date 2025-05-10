import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    CircularProgress
} from '@mui/material';

const MockPayment = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [orderId, setOrderId] = useState('');
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        // Get parameters from URL
        const transactionIdParam = searchParams.get('transactionId');
        const orderIdParam = searchParams.get('orderId');
        const amountParam = searchParams.get('amount');

        if (transactionIdParam) setTransactionId(transactionIdParam);
        if (orderIdParam) setOrderId(orderIdParam);
        if (amountParam) setAmount(parseFloat(amountParam));
    }, [searchParams]);

    const handlePayment = async (status) => {
        try {
            setLoading(true);

            // Call the appropriate endpoint based on status
            const endpoint = `/api/payment/${status}`;
            await axios.post(endpoint, { transactionId });

            // Navigate directly to foodie-profile regardless of status
            navigate('/foodie-profile');
        } catch (error) {
            // Even if there's an error, navigate to foodie-profile
            console.error('Payment error:', error);
            navigate('/foodie-profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Mock Payment
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Order Details
                    </Typography>
                    <Typography variant="body1">
                        Order ID: {orderId}
                    </Typography>
                    <Typography variant="body1">
                        Amount: ${amount.toFixed(2)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Test Card Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Card Number"
                                value="4242 4242 4242 4242"
                                disabled
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Expiry"
                                value="12/25"
                                disabled
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="CVC"
                                value="123"
                                disabled
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handlePayment('success')}
                        disabled={loading}
                        sx={{ minWidth: 120 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Pay Now'}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handlePayment('fail')}
                        disabled={loading}
                        sx={{ minWidth: 120 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Fail Payment'}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => handlePayment('cancel')}
                        disabled={loading}
                        sx={{ minWidth: 120 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Cancel'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default MockPayment; 