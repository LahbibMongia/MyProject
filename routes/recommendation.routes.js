var express = require('express');
var router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');

router.post('/createRecommendation', recommendationController.createRecommendation);
router.get('/getRecommendation/:id', recommendationController.getRecommendation);
router.get('/getRecommendationByParent/:parentId', recommendationController.getRecommendationByParent);
router.get('/getRecommendationByBabysitter/:babysitterId', recommendationController.getRecommendationByBabysitter);
router.put('/updateRecommendation/:id', recommendationController.updateRecommendation);
router.delete('/deleteRecommendation/:id', recommendationController.deleteRecommendation);

module.exports = router;    