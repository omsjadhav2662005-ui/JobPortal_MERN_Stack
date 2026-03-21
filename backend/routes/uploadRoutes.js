const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const { protect } = require('../middleware/authMiddleware');
const {
  uploadProfilePic,
  uploadResume,
} = require('../controllers/uploadController');

router.post('/profile-pic', protect, upload.single('image'), uploadProfilePic);
router.post('/resume', protect, upload.single('file'), uploadResume);

module.exports = router;