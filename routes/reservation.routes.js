var express = require('express');
var router = express.Router();
const reservationController = require('../controllers/reservation.contoller');

router.post('/createReservation', reservationController.createReservation);

router.get('/getReservationsByBabysitter/:babysitterId', reservationController.getReservationsByBabysitter);
router.get('/getReservationsByParent/:parentId', reservationController.getReservationsByParent);
router.get('/getReservation/:id', reservationController.getReservation);

router.put('/updateReservation/:id', reservationController.updateReservation);
router.delete('/deleteReservation/:id', reservationController.deleteReservation);

module.exports = router;
