const r = require('express').Router();
const { updateUserProfile, getUsers, getUserById, sendConnectionRequest, respondToConnection, removeConnection, addNotification, markNotificationRead } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
// Static routes MUST come before /:id to avoid Express matching them as IDs
r.route('/').get(getUsers);  // public - Network page shows users to everyone
r.route('/profile').put(protect, updateUserProfile);
r.put('/connections/:fromId/respond', protect, respondToConnection);
r.delete('/connections/:id', protect, removeConnection);
r.post('/notification', protect, addNotification);
r.put('/notification/:id/read', protect, markNotificationRead);
// Dynamic :id routes come last
r.get('/:id', protect, getUserById);
r.post('/:id/connect', protect, sendConnectionRequest);
module.exports = r;
