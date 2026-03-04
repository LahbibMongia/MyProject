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

notificationSchema.index({ user: 1 });

module.exports.AssignNotificationToUser = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const userId = req.params.userId;

    const notificationData = await Notification.findById(notificationId);

    if (!notificationData) {
      throw new Error("Notification not found");
    }

    // check if already assigned
    if (notificationData.user && notificationData.user.toString() === userId) {
      throw new Error("Notification already assigned to user");
    }

    // Update this notification only if it’s not already assigned to this user.
    const UpdatedNotification = await Notification.findOneAndUpdate( 
      { _id: notificationId, user: { $ne: userId } },
      { user: userId },
      { new: true }
    );

    if (!UpdatedNotification) {
      throw new Error("Notification not found or already assigned to user");
    }

    res.status(200).json({
      message: "Notification assigned successfully",
      data: UpdatedNotification
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
///assign/:notificationId/:userId

module.exports = notificationController;