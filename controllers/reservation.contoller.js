// controllers/reservation.controller.js

const Reservation = require("../models/reservation.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model"); // Imported for automated status alerts

/* =======================================================
   1. CREATE RESERVATION (POST /api/reservations)
======================================================= */
module.exports.createReservation = async (req, res) => {
  try {
    const { parent, babysitter, date, timeSlot, details } = req.body;

    // Validate parent existence and role
    const parentUser = await User.findById(parent);
    if (!parentUser || parentUser.role !== "parent") {
      return res.status(404).json({
        success: false,
        message: "Parent profile not found.",
      });
    }

    // Validate babysitter existence and role
    const babysitterUser = await User.findById(babysitter);
    if (!babysitterUser || babysitterUser.role !== "babysitter") {
      return res.status(404).json({
        success: false,
        message: "Babysitter profile not found.",
      });
    }

    // Dynamic slot duplicate check: blocks double-bookings on the same day + slot
    const existingReservation = await Reservation.findOne({
      babysitter,
      date,
      timeSlot,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingReservation) {
      return res.status(409).json({
        success: false,
        message: "This babysitter already has a pending or confirmed booking for this time slot.",
      });
    }

    const newReservation = await Reservation.create({
      parent,
      babysitter,
      date,
      timeSlot,
      details,
    });

    // Notify Babysitter of new pending request
    await Notification.create({
      user: babysitter,
      type: "reservation",
      message: `You have received a new reservation request from ${parentUser.name}.`,
    });

    return res.status(201).json({
      success: true,
      message: "Reservation created successfully.",
      data: newReservation,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =======================================================
   2. ACCEPT RESERVATION (PUT /api/reservations/:id/accept)
======================================================= */
module.exports.acceptReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    reservation.status = "confirmed";
    await reservation.save();

    // Alert parent of acceptance
    await Notification.create({
      user: reservation.parent,
      type: "reservation",
      message: "Your reservation has been confirmed.",
    });

    return res.status(200).json({
      success: true,
      message: "Reservation accepted successfully.",
      data: reservation,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =======================================================
   3. DECLINE RESERVATION (PUT /api/reservations/:id/decline)
======================================================= */
module.exports.declineReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    reservation.status = "cancelled";
    await reservation.save();

    // Alert parent of decline
    await Notification.create({
      user: reservation.parent,
      type: "reservation",
      message: "Your reservation has been declined.",
    });

    return res.status(200).json({
      success: true,
      message: "Reservation declined successfully.",
      data: reservation,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =======================================================
   4. CANCEL RESERVATION (PUT /api/reservations/:id/cancel)
======================================================= */
module.exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    // Safety constraint check: only pending reservations can be cancelled
    if (reservation.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending reservations can be cancelled.",
      });
    }

    reservation.status = "cancelled";
    await reservation.save();

    // Alert Babysitter that parent pulled out
    await Notification.create({
      user: reservation.babysitter,
      type: "reservation",
      message: "A reservation has been cancelled by the parent.",
    });

    return res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully.",
      data: reservation,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =======================================================
   5. GET ALL RESERVATIONS (GET /api/reservations)
======================================================= */
module.exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("parent", "name email phone")
      .populate("babysitter", "name hourlyRate");

    return res.status(200).json({
      success: true,
      message: "All reservations retrieved successfully.",
      data: reservations,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =======================================================
   6. GET RESERVATION BY ID (GET /api/reservations/:id)
======================================================= */
module.exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("parent", "name email phone")
      .populate("babysitter", "name hourlyRate");

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reservation details retrieved successfully.",
      data: reservation,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =======================================================
   7. GET RESERVATIONS BY PARENT (GET /api/reservations/parent/:parentId)
======================================================= */
module.exports.getReservationsByParent = async (req, res) => {
  try {
    const { parentId } = req.params;

    // Parent identity validation
    const parent = await User.findById(parentId);
    if (!parent || parent.role !== "parent") {
      return res.status(404).json({
        success: false,
        message: "Parent profile not found.",
      });
    }

    // Fetches parent's reservations, sorted by newest first, populating babysitter info
    const reservations = await Reservation.find({ parent: parentId })
      .populate("babysitter", "name hourlyRate phone image profilePicture")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: "Parent reservations retrieved successfully.",
      data: reservations,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =======================================================
   8. GET RESERVATIONS BY BABYSITTER (GET /api/reservations/babysitter/:babysitterId)
======================================================= */
module.exports.getReservationsByBabysitter = async (req, res) => {
  try {
    const { babysitterId } = req.params;

    // Babysitter identity validation
    const babysitter = await User.findById(babysitterId);
    if (!babysitter || babysitter.role !== "babysitter") {
      return res.status(404).json({
        success: false,
        message: "Babysitter profile not found.",
      });
    }

    const reservations = await Reservation.find({ babysitter: babysitterId })
      .populate("parent", "name phone adresse image");

    return res.status(200).json({
      success: true,
      message: "Babysitter reservations retrieved successfully.",
      data: reservations,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =======================================================
   9. UPDATE RESERVATION DETAILS (PUT /api/reservations/:id)
======================================================= */
module.exports.updateReservation = async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reservation updated successfully.",
      data: updatedReservation,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =======================================================
   10. HARD DELETE RESERVATION (DELETE /api/reservations/:id)
======================================================= */
module.exports.deleteReservation = async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!deletedReservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reservation deleted from database successfully.",
      data: deletedReservation,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};