const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');
const handleErrorAsync = require('../service/handleErrorAsync');
const upload = require('../service/image');
const { isAuth } = require('../service/auth');

router.post('/', isAuth, upload, handleErrorAsync(uploadController.file));
router.post('/imgur', isAuth, upload, handleErrorAsync(uploadController.imgur));

module.exports = router;