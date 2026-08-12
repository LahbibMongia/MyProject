var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller');
const upload = require('../middlewares/uploadfile');
const logMiddleware = require('../middlewares/LogsMiddleware');

/* =======================================================
   BABYSITTER DISCOVERY & BOOKING ROUTES
======================================================= */
// Fetch all babysitters (supports ?search= and ?maxRate= query params)
router.get('/babysitters', userController.getBabysitters);

// Fetch a single babysitter profile by ID
router.get('/babysitters/:id', userController.getBabysitterById);

// Create a new booking/reservation request
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

// Upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        message: 'Upload réussi',
        file: req.file
    });
});

// router.post('/CreateUserWithImage', upload.single('user_image'), userController.createUserWithImage);

router.put('/updateUser/:id', userController.UpdateUser);
router.delete('/DeleteUser/:id', userController.deleteUser);


module.exports = router;