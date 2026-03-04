const Reservation = require ('../models/reservation.model');
const Notification = require ('../models/notification.model');
const User = require ('../models/user.model');

const existingReservation = async (req, res) => {
    try {
        const { babysitter, date } = req.body;  
        const reservation = await Reservation.findOne({
            babysitter,
            date,
            status: { $in: ['pending', 'confirmed'] }
        });
        if (reservation) {
            return res.status(400).json({ message: "Reservation already exists" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createReservation = async (req, res) => {
  try {
    const { date, parent, babysitter } = req.body;

    // 1 Validate users
    const parentUser = await User.findById(parent);
    const babysitterUser = await User.findById(babysitter);

    if (!parentUser || parentUser.role !== 'parent') {
      return res.status(400).json({ message: "Invalid parent" });
    }

    if (!babysitterUser || babysitterUser.role !== 'babysitter') {
      return res.status(400).json({ message: "Invalid babysitter" });
    }

    // 2 Create reservation
    const reservation = await Reservation.create({
      date,
      parent,
      babysitter
    });

    // Create notification (no second response!)
    await Notification.create({
      user: babysitter,
      type: 'Reservation',
      message: `You have a new reservation from ${parentUser.nom}`,
    });

    res.status(201).json(reservation);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const updateReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

    const getReservationsByBabysitter = async (req, res) => {
    try {
        const { babysitterId } = req.params;

        // Optional security check: verify role
        const babysitter = await User.findById(babysitterId);

        if (!babysitter || babysitter.role !== 'babysitter') {
        return res.status(404).json({
            message: "Babysitter not found"
        });
        }

        const reservations = await Reservation.find({
        babysitter: babysitterId
        })
        .populate('parent', 'nom prenom adresse')
        .sort({ createdAt: -1 });

        res.status(200).json(reservations);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };

    const getReservationsByParent = async (req, res) => {
        try {
            const { parentId } = req.params;
            const reservations = await Reservation.find({ parent: parentId }).sort({ createdAt: -1 });
            res.status(200).json(reservations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    reservationSchema.index({ babysitter: 1, status: 1 }); //MongoDB jumps directly to babysitter X, and inside that small slice it filters by status. Fast. Surgical. Elegant.

module.exports = { createReservation, getReservation, updateReservation, deleteReservation, getReservationsByBabysitter, getReservationsByParent };


module.exports.AssignReservationToParent = async (req, res) => {
  try{
    const reservationId = req.params.id;
    const userId = req.params.id;
    const reservationData = await reservation.findById (reservationId);
    const reservations = await Reservation.find({ parent: userId })
    if (!reservationData) {
      throw new Error("Reservation not found");
    }
    if (reservations.includes(reservationData)) {
      throw new Error("Reservation already assigned to babysitter");
    }
    const UpdatedReservation = await reservationData.findByIdAndUpdate(  reservationId, {parent  : userId}, {new: true});
    res
      .status(200)
      .json({ message: "Reservation assigned successfully", data: UpdatedReservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}