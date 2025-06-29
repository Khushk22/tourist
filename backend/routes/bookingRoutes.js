const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

// Create a new booking
router.post('/create', async (req, res) => {
    try {
        const { name, email, phone, startDate, endDate, packageType, comments, paymentMethod, cardDetails } = req.body;
        const newBooking = new Booking({
            name,
            email,
            phone,
            startDate,
            endDate,
            packageType,
            comments,
            paymentMethod,
            cardDetails: paymentMethod === 'Card' ? cardDetails : null,
        });
        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

module.exports = router;
