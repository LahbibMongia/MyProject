const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
    {
        date: { type: Date, required: true },
        timeSlot: { type: String, required: true },
        notes: { type: String },
        totalPrice: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending"
        },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        babysitter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

reservationSchema.index({ babysitter: 1, status: 1 }); //MongoDB jumps directly to babysitter X, and inside that small slice it filters by status. Fast. Surgical. Elegant.
reservationSchema.index({ parent: 1, createdAt: -1 });

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;