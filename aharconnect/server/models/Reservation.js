const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in minutes
        default: 120
    },
    guests: {
        type: Number,
        required: true,
        min: 1
    },
    tableNumber: {
        type: String
    },
    isEvent: {
        type: Boolean,
        default: false
    },
    eventType: {
        type: String,
        enum: ['Birthday', 'Anniversary', 'Corporate', 'Other'],
        default: 'Other'
    },
    eventPackage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventPackage'
    },
    specialRequest: String,
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    depositAmount: {
        type: Number,
        default: 0
    },
    depositPaid: {
        type: Boolean,
        default: false
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
reservationSchema.index({ dateTime: 1 });
reservationSchema.index({ customerId: 1 });
reservationSchema.index({ status: 1 });

// Add method to check if reservation is in the past
reservationSchema.methods.isPast = function() {
    return this.dateTime < new Date();
};

// Add method to check if reservation is upcoming
reservationSchema.methods.isUpcoming = function() {
    return this.dateTime > new Date();
};

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;