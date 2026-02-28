const Notification = require('../models/notification.model');

const notificationController = {
    createNotification : async (req, res) => {
        try {
            const notification = new Notification(req.body);
            await notification.save();
            res.status(201).json(notification);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getNotification : async (req, res) => {
        try {
            const notification = await Notification.findById(req.params.id);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.status(200).json(notification);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getNotificationByUser : async (req, res) => {
        try {
            const notification = await Notification.find({ user: req.params.userId });
            res.status(200).json(notification);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateNotification : async (req, res) => {
        try {
            const notification = await Notification.findById(req.params.id);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            notification.set(req.body);
            await notification.save();
            res.status(200).json(notification);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteNotification : async (req, res) => {
        try {
            const notification = await Notification.findById(req.params.id);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            await notification.remove();
            res.status(200).json({ message: 'Notification deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = notificationController;