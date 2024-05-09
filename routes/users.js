const express = require('express');
var router = express.Router();
const usersController = require('../controllers/users');
const handleErrorAsync = require('../service/handleErrorAsync');
const {isAuth} = require('../service/auth');

router.post('/sign_up',handleErrorAsync(usersController.sign_up))

router.post('/sign_in',handleErrorAsync(usersController.sign_in))

router.get('/profile/',isAuth,handleErrorAsync(usersController.profile))

router.post('/updatePassword',isAuth,handleErrorAsync(usersController.updatePassword))

module.exports = router;