const SSLCommerzPayment = require('sslcommerz-lts');
const Order = require('../models/Order');

// SSLCommerz configuration
const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASSWORD;
const is_live = false; // Force sandbox mode

// Mock payment statuses
const PAYMENT_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
};

// Initialize payment
exports.initPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        // Get order details with populated fields
        const order = await Order.findById(orderId)
            .populate('userId', 'name email')
            .populate('restaurantId', 'name');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Create unique transaction ID
        const transactionId = `MOCK_${order._id}_${Date.now()}`;

        // Update order with transaction ID and payment status
        order.transactionId = transactionId;
        order.paymentStatus = 'pending';
        order.status = 'pending';
        await order.save();

        console.log('[PaymentController] Payment initialized:', {
            orderId: order._id,
            transactionId,
            amount: order.totalAmount
        });

        // Return mock payment page URL
        res.json({ 
            redirectUrl: `${process.env.CLIENT_URL}/mock-payment?orderId=${order._id}&transactionId=${transactionId}&amount=${order.totalAmount}`
        });
    } catch (error) {
        console.error('[PaymentController] Payment initialization error:', error);
        res.status(500).json({ error: 'Payment initialization failed' });
    }
};

// Mock payment success
exports.paymentSuccess = async (req, res) => {
    try {
        const { transactionId } = req.body;
        
        if (!transactionId) {
            console.error('[PaymentController] No transaction ID provided');
            return res.status(400).json({ error: 'Transaction ID is required' });
        }

        console.log('[PaymentController] Processing payment success:', { transactionId });

        // Update order status with all necessary fields
        const order = await Order.findOneAndUpdate(
            { transactionId },
            { 
                status: 'confirmed',
                paymentStatus: PAYMENT_STATUS.SUCCESS,
                paymentDate: new Date(),
                $set: { 'paymentDetails.status': 'completed' }
            },
            { new: true }
        ).populate('userId', 'name email')
         .populate('restaurantId', 'name');

        if (!order) {
            console.error('[PaymentController] Order not found for transaction:', transactionId);
            return res.status(404).json({ error: 'Order not found' });
        }

        console.log('[PaymentController] Payment successful:', {
            orderId: order._id,
            status: order.status,
            paymentStatus: order.paymentStatus
        });

        // Redirect to success page
        res.redirect(`${process.env.CLIENT_URL}/foodie-profile`);
    } catch (error) {
        console.error('[PaymentController] Payment success handling error:', error);
        res.status(500).json({ error: 'Payment success handling failed' });
    }
};

// Mock payment failure
exports.paymentFail = async (req, res) => {
    try {
        const { transactionId } = req.body;
        
        console.log('[PaymentController] Processing payment failure:', { transactionId });

        // Update order status with all necessary fields
        const order = await Order.findOneAndUpdate(
            { transactionId },
            { 
                status: 'cancelled',
                paymentStatus: PAYMENT_STATUS.FAILED,
                paymentDate: new Date(),
                $set: { 'paymentDetails.status': 'failed' }
            },
            { new: true }
        ).populate('userId', 'name email')
         .populate('restaurantId', 'name');

        if (!order) {
            console.error('[PaymentController] Order not found for transaction:', transactionId);
            return res.status(404).json({ error: 'Order not found' });
        }

        console.log('[PaymentController] Payment failed:', {
            orderId: order._id,
            status: order.status,
            paymentStatus: order.paymentStatus
        });

        // Redirect to foodie profile
        res.redirect(`${process.env.CLIENT_URL}/foodie-profile`);
    } catch (error) {
        console.error('[PaymentController] Payment failure handling error:', error);
        res.status(500).json({ error: 'Payment failure handling failed' });
    }
};

// Mock payment cancellation
exports.paymentCancel = async (req, res) => {
    try {
        const { transactionId } = req.body;
        
        console.log('[PaymentController] Processing payment cancellation:', { transactionId });

        // Update order status with all necessary fields
        const order = await Order.findOneAndUpdate(
            { transactionId },
            { 
                status: 'cancelled',
                paymentStatus: PAYMENT_STATUS.CANCELLED,
                paymentDate: new Date(),
                $set: { 'paymentDetails.status': 'cancelled' }
            },
            { new: true }
        ).populate('userId', 'name email')
         .populate('restaurantId', 'name');

        if (!order) {
            console.error('[PaymentController] Order not found for transaction:', transactionId);
            return res.status(404).json({ error: 'Order not found' });
        }

        console.log('[PaymentController] Payment cancelled:', {
            orderId: order._id,
            status: order.status,
            paymentStatus: order.paymentStatus
        });

        // Redirect to foodie profile
        res.redirect(`${process.env.CLIENT_URL}/foodie-profile`);
    } catch (error) {
        console.error('[PaymentController] Payment cancellation handling error:', error);
        res.status(500).json({ error: 'Payment cancellation handling failed' });
    }
};

// Check payment status
exports.checkPaymentStatus = async (req, res) => {
    try {
        const { transactionId } = req.params;
        
        console.log('[PaymentController] Checking payment status:', { transactionId });

        const order = await Order.findOne({ transactionId })
            .populate('userId', 'name email')
            .populate('restaurantId', 'name');
        
        if (!order) {
            console.error('[PaymentController] Order not found for transaction:', transactionId);
            return res.status(404).json({ error: 'Order not found' });
        }

        console.log('[PaymentController] Payment status retrieved:', {
            orderId: order._id,
            status: order.status,
            paymentStatus: order.paymentStatus
        });

        res.json({
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentDate: order.paymentDate,
            orderId: order._id
        });
    } catch (error) {
        console.error('[PaymentController] Payment status check error:', error);
        res.status(500).json({ error: 'Payment status check failed' });
    }
}; 