var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller');
const upload = require('../middlewares/uploadfile');
const logMiddleware = require('../middlewares/LogsMiddleware');

/* =======================================================
   BABYSITTER DISCOVERY & BOOKING ROUTES
======================================================= */
router.get('/babysitters', userController.getBabysitters);
router.get('/babysitters/:id', userController.getBabysitterById);
router.post('/bookings', userController.createBooking);

/* =======================================================
   AUTHENTICATION ROUTES
======================================================= */
router.post('/register', userController.register);
router.post('/login', userController.login);

/* =======================================================
   USER MANAGEMENT ROUTES
======================================================= */
router.get('/GetAllUsers', logMiddleware, userController.getAllUsers);
router.get('/GetUserById/:id', userController.getUserById);
router.post('/CreateUser', userController.createUser);
router.post('/CreateUserAdmin', userController.createUserAdmin);

router.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        message: 'Upload réussi',
        file: req.file
    });
});

router.put('/updateUser/:id', userController.UpdateUser);
router.delete('/DeleteUser/:id', userController.deleteUser);

module.exports = router;