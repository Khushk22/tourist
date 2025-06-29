const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    packageType: { type: String, required: true },
    comments: { type: String },
    paymentMethod: { type: String, required: true },
    cardDetails: {
        cardNumber: { type: String },
        cardExpiry: { type: String },
        cardCVC: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
