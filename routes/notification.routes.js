var express = require('express');
var router = express.Router();
const notificationController = require('../controllers/notification.controller');

router.post('/createNotification', notificationController.createNotification);
router.get('/getNotification/:id', notificationController.getNotification);
router.get('/getNotificationByUser/:userId', notificationController.getNotificationByUser);
router.put('/updateNotification/:id', notificationController.updateNotification);
router.delete('/deleteNotification/:id', notificationController.deleteNotification);

module.exports = router;