var express = require('express');
var router = express.Router();
const userController = require ('../controllers/user.controller');

/* GET users listing. */
router.get('/GetAllUsers', userController.getAllUsers );
router.get('/GetUserById/id', userController.getUserById );

router.post('/CreateUser', userController.createUser);

module.exports = router;

