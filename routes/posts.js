const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const handleErrorAsync = require('../service/handleErrorAsync');
const {isAuth} = require('../service/auth');

//動態貼文
router.get('/',isAuth,handleErrorAsync(postsController.getPosts));
router.get('/:postID',isAuth,handleErrorAsync(postsController.getPost));
router.post('/',isAuth,handleErrorAsync(postsController.createPost));
router.patch('/:postID',isAuth,handleErrorAsync(postsController.updatePost));
router.delete('/:postID',isAuth,handleErrorAsync(postsController.deletePost));
router.delete('/',isAuth,handleErrorAsync(postsController.deletePosts));
router.post('/:postID/like',isAuth,handleErrorAsync(postsController.createLike));
router.delete('/:postID/unlike',isAuth,handleErrorAsync(postsController.deleteLike));
router.post('/:postID/comment',isAuth,handleErrorAsync(postsController.createComment));
router.get('/user/:userID',isAuth,handleErrorAsync(postsController.getPostsByUserID));

module.exports = router;