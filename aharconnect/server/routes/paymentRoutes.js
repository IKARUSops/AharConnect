const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Initialize payment
router.post('/init/:orderId', authMiddleware, paymentController.initPayment);

// Mock payment endpoints
router.post('/success', paymentController.paymentSuccess);
router.post('/fail', paymentController.paymentFail);
router.post('/cancel', paymentController.paymentCancel);

// Check payment status
router.get('/status/:transactionId', authMiddleware, paymentController.checkPaymentStatus);

module.exports = router; 