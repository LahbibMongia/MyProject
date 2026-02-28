const Reservation = require ('../models/reservation.model');
const Notification = require ('../models/notification.model');

const createReservation = async (req, res) => {
    try {
        const reservation = await Reservation.create(req.body);
        res.status(201).json(reservation);
        const notification = await Notification.create({
            user: reservation.babysitter,   
            type: 'reservation',
            message: `You have a new reservation from ${reservation.parent}`,
            reservation: reservation._id
        });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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

module.exports = { createReservation, getReservation, updateReservation, deleteReservation, getReservationsByBabysitter, getReservationsByParent };