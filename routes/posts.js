const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const handleErrorAsync = require('../service/handleErrorAsync');
const {isAuth} = require('../service/auth');

router.get('/:id',isAuth,handleErrorAsync(postsController.getPost));
router.get('/',isAuth,handleErrorAsync(postsController.getPosts));
router.post('/',isAuth,handleErrorAsync(postsController.createPost));
router.patch('/:id',isAuth,handleErrorAsync(postsController.updatePost));
router.delete('/:id',isAuth,handleErrorAsync(postsController.deletePost));
router.delete('/',isAuth,handleErrorAsync(postsController.deletePosts));

module.exports = router;