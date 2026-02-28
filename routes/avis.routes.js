var express = require('express');
var router = express.Router();
const avisController = require('../controllers/avis.controller');

router.post('/createAvis', avisController.createAvis);
router.get('/getAvis/:id', avisController.getAvis);
router.get('/getAvisByParent/:parentId', avisController.getAvisByParent);
router.get('/getAvisByBabysitter/:babysitterId', avisController.getAvisByBabysitter);
router.put('/updateAvis/:id', avisController.updateAvis);
router.delete('/deleteAvis/:id', avisController.deleteAvis);
module.exports = router;