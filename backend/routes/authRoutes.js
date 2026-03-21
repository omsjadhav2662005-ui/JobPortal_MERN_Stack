const r = require('express').Router();
const { registerUser, loginUser, getUserProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
r.post('/register', registerUser);
r.post('/login', loginUser);
r.get('/profile', protect, getUserProfile);
r.put('/change-password', protect, changePassword);
module.exports = r;
