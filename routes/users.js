const express = require('express');
var router = express.Router();
const usersController = require('../controllers/users');
const handleErrorAsync = require('../service/handleErrorAsync');
const {isAuth} = require('../service/auth');

router.post('/sign_up',handleErrorAsync(usersController.sign_up))

router.post('/sign_in',handleErrorAsync(usersController.sign_in))

router.get('/getProfile/',isAuth,handleErrorAsync(usersController.getProfile))

router.patch('/updatePassword',isAuth,handleErrorAsync(usersController.updatePassword))

router.patch('/updateProfile/',isAuth,handleErrorAsync(usersController.updateProfile))

module.exports = router;