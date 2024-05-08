var express = require('express');
var router = express.Router();
const postsController = require('../controllers/posts');

router.get('/:id', postsController.getPost);
router.get('/', postsController.getPosts);
router.post('/', postsController.createPost);
router.patch('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);
router.delete('/', postsController.deletePosts);

module.exports = router;