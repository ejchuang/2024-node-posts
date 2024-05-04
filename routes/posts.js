var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController');

router.get('/:id', postsController.getPost);
router.get('/', postsController.getAllPosts);
router.post('/', postsController.createPost);
router.patch('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);
router.delete('/', postsController.deleteAllPosts);

module.exports = router;