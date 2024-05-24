const express = require('express');
var router = express.Router();
const usersController = require('../controllers/users');
const handleErrorAsync = require('../service/handleErrorAsync');
const {isAuth} = require('../service/auth');

//會員功能
router.post('/sign_up',handleErrorAsync(usersController.sign_up))
router.post('/sign_in',handleErrorAsync(usersController.sign_in))
router.patch('/updatePassword',isAuth,handleErrorAsync(usersController.updatePassword))
router.get('/profile/',isAuth,handleErrorAsync(usersController.getProfile))
router.patch('/profile/',isAuth,handleErrorAsync(usersController.updateProfile))

//會員按讚追蹤動態
router.post('/:userID/follow',isAuth,handleErrorAsync(usersController.createFollow))
router.delete('/:userID/unfollow',isAuth,handleErrorAsync(usersController.deleteFollow))
router.get('/getLikeList/',isAuth,handleErrorAsync(usersController.getLikeList))
router.get('/following',isAuth,handleErrorAsync(usersController.getFollowing))


module.exports = router;