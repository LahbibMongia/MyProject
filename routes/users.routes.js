var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller');
const upload = require('../middlewares/uploadfile');



/* GET users listing. */
router.get('/GetAllUsers', userController.getAllUsers);
router.get('/GetUserById/:id', userController.getUserById);

router.post('/CreateUser', userController.createUser);

// route upload
router.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        message: 'Upload réussi',
        file: req.file
    });
});
//router.post('/CreateUserWithImage', upload.single('user_image'), userController.createUserWithImage);
router.post('/CreateUserAdmin', userController.createUserAdmin);
router.delete('/DeleteUser/:id', userController.deleteUser);

router.put('/updateUser/:id', userController.UpdateUser);



module.exports = router;
