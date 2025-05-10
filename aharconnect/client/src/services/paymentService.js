import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Initialize payment
export const initiatePayment = async (orderId) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post(
            `${API_URL}/payment/init/${orderId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // Redirect to mock payment page with all necessary data
        if (response.data.redirectUrl) {
            window.location.href = response.data.redirectUrl;
        } else {
            throw new Error('No payment gateway URL received');
        }
    } catch (error) {
        console.error('Payment initiation error:', error);
        throw error;
    }
};

// Check payment status
export const checkPaymentStatus = async (paymentId) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(
            `${API_URL}/payment/status/${paymentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Payment status check error:', error);
        throw error;
    }
}; 