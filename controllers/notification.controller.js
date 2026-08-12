const Notification = require('../models/notification.model');

const createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        return res.status(201).json(notification);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        return res.status(200).json(notification);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getNotificationByUser = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.params.userId });
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        notification.set(req.body);
        await notification.save();
        return res.status(200).json(notification);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        return res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const assignNotificationToUser = async (req, res) => {
    try {
        const { notificationId, userId } = req.params;

        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (notification.user && notification.user.toString() === userId) {
            return res.status(400).json({ message: "Notification already assigned to user" });
        }

        notification.user = userId;
        await notification.save();

        return res.status(200).json({
            message: "Notification assigned successfully",
            data: notification
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNotification,
    getNotification,
    getNotificationByUser,
    updateNotification,
    deleteNotification,
    assignNotificationToUser
};