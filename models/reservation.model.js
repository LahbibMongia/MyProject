const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
    {
        date: { type: Date },
        status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        babysitter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    },
    { timestamp: true }
);

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation; 