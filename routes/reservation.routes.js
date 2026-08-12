// routes/reservation.routes.js

const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservation.contoller");

// Fetch all reservations for a specific parent (to render on their profile)
router.get(
    "/parent/:parentId",
    reservationController.getReservationsByParent
);

// Cancel a reservation by ID (updates status to 'cancelled')
router.patch(
    "/:id/cancel",
    reservationController.cancelReservation
);

module.exports = router;