const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');
const handleErrorAsync = require('../service/handleErrorAsync');
const upload = require('../service/image');
const { isAuth } = require('../service/auth');

router.post('/file', isAuth, upload, handleErrorAsync(uploadController.file));

module.exports = router;