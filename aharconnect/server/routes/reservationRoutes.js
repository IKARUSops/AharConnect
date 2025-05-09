const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { auth, adminAuth } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Get all reservations (admin only)
router.get('/admin', adminAuth, async (req, res) => {
    try {
        const { status, startDate, endDate, isEvent } = req.query;
        let query = {};

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Filter by date range
        if (startDate && endDate) {
            query.dateTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Filter by event type
        if (isEvent) {
            query.isEvent = isEvent === 'true';
        }

        const reservations = await Reservation.find(query)
            .sort({ dateTime: 1 })
            .populate('customerId', 'name email phone')
            .populate('eventPackage');

        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's reservations
router.get('/my-reservations', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ customerId: req.user._id })
            .sort({ dateTime: -1 })
            .populate('eventPackage');

        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single reservation
router.get('/:id', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('customerId', 'name email phone')
            .populate('eventPackage');

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Check if user is authorized to view this reservation
        if (req.user.role !== 'admin' && reservation.customerId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to view this reservation' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create reservation
router.post('/', auth, async (req, res) => {
    try {
        const {
            dateTime,
            guests,
            isEvent,
            eventType,
            eventPackage,
            specialRequest
        } = req.body;

        // Check if the requested time slot is available
        const existingReservation = await Reservation.findOne({
            dateTime: {
                $gte: new Date(dateTime),
                $lt: new Date(new Date(dateTime).getTime() + 120 * 60000) // 2 hours slot
            },
            status: { $in: ['Pending', 'Confirmed'] }
        });

        if (existingReservation) {
            return res.status(400).json({ error: 'This time slot is already booked' });
        }

        const reservation = new Reservation({
            customerId: req.user._id,
            customerName: req.user.name,
            customerEmail: req.user.email,
            customerPhone: req.user.phone,
            dateTime,
            guests,
            isEvent,
            eventType,
            eventPackage,
            specialRequest
        });

        await reservation.save();

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: req.user.email,
            subject: 'Reservation Confirmation',
            html: `
                <h1>Reservation Confirmation</h1>
                <p>Dear ${req.user.name},</p>
                <p>Your reservation has been received and is pending confirmation.</p>
                <p>Details:</p>
                <ul>
                    <li>Date & Time: ${new Date(dateTime).toLocaleString()}</li>
                    <li>Number of Guests: ${guests}</li>
                    <li>Type: ${isEvent ? 'Event' : 'Table Reservation'}</li>
                    ${isEvent ? `<li>Event Type: ${eventType}</li>` : ''}
                </ul>
                <p>We will contact you shortly to confirm your reservation.</p>
            `
        });

        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update reservation status (admin only)
router.patch('/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findById(req.params.id)
            .populate('customerId', 'name email');

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        reservation.status = status;
        await reservation.save();

        // Send status update email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: reservation.customerEmail,
            subject: 'Reservation Status Update',
            html: `
                <h1>Reservation Status Update</h1>
                <p>Dear ${reservation.customerName},</p>
                <p>Your reservation status has been updated to: ${status}</p>
                <p>Details:</p>
                <ul>
                    <li>Date & Time: ${new Date(reservation.dateTime).toLocaleString()}</li>
                    <li>Number of Guests: ${reservation.guests}</li>
                    <li>Type: ${reservation.isEvent ? 'Event' : 'Table Reservation'}</li>
                </ul>
                <p>Thank you for choosing our restaurant!</p>
            `
        });

        res.json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Cancel reservation
router.patch('/:id/cancel', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Check if user is authorized to cancel this reservation
        if (req.user.role !== 'admin' && reservation.customerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to cancel this reservation' });
        }

        // Check if reservation can be cancelled
        if (!['Pending', 'Confirmed'].includes(reservation.status)) {
            return res.status(400).json({ error: 'Reservation cannot be cancelled in its current status' });
        }

        reservation.status = 'Cancelled';
        await reservation.save();

        // Send cancellation email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: reservation.customerEmail,
            subject: 'Reservation Cancelled',
            html: `
                <h1>Reservation Cancelled</h1>
                <p>Dear ${reservation.customerName},</p>
                <p>Your reservation has been cancelled.</p>
                <p>Details:</p>
                <ul>
                    <li>Date & Time: ${new Date(reservation.dateTime).toLocaleString()}</li>
                    <li>Number of Guests: ${reservation.guests}</li>
                    <li>Type: ${reservation.isEvent ? 'Event' : 'Table Reservation'}</li>
                </ul>
                <p>We hope to serve you another time!</p>
            `
        });

        res.json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get reservation analytics (admin only)
router.get('/analytics/summary', adminAuth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        if (startDate && endDate) {
            query.dateTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const totalReservations = await Reservation.countDocuments(query);
        const reservationsByStatus = await Reservation.aggregate([
            { $match: query },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const reservationsByType = await Reservation.aggregate([
            { $match: query },
            { $group: { _id: '$isEvent', count: { $sum: 1 } } }
        ]);

        const reservationsByEventType = await Reservation.aggregate([
            { $match: { ...query, isEvent: true } },
            { $group: { _id: '$eventType', count: { $sum: 1 } } }
        ]);

        res.json({
            totalReservations,
            reservationsByStatus,
            reservationsByType,
            reservationsByEventType
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;