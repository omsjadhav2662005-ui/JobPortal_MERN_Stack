const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const userPayload = (user, token) => ({
  _id: user._id, name: user.name, email: user.email, role: user.role,
  profilePicture: user.profilePicture, headline: user.headline, about: user.about,
  phone: user.phone, location: user.location,
  skills: user.skills, certifications: user.certifications, socialLinks: user.socialLinks,
  education: user.education, experience: user.experience, resume: user.resume,
  appliedJobs: user.appliedJobs, savedJobs: user.savedJobs,
  connections: user.connections, connectionRequests: user.connectionRequests,
  notifications: user.notifications, token,
});

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) { res.status(400); throw new Error('All fields required'); }
    if (password.length < 6) { res.status(400); throw new Error('Password must be at least 6 characters'); }
    if (await User.findOne({ email })) { res.status(400); throw new Error('Email already registered'); }
    const user = await User.create({ name, email, password, role: role || 'jobseeker' });
    res.status(201).json(userPayload(user, generateToken(user._id)));
  } catch (e) { next(e); }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400); throw new Error('Email and password required'); }
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) { res.status(401); throw new Error('Invalid email or password'); }
    user.lastActive = new Date(); await user.save({ validateBeforeSave: false });
    res.json(userPayload(user, generateToken(user._id)));
  } catch (e) { next(e); }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) { res.status(404); throw new Error('User not found'); }
    res.json(user);
  } catch (e) { next(e); }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) { res.status(400); throw new Error('Both passwords required'); }
    if (newPassword.length < 6) { res.status(400); throw new Error('New password min 6 characters'); }
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword))) { res.status(401); throw new Error('Current password incorrect'); }
    user.password = newPassword; await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (e) { next(e); }
};

module.exports = { registerUser, loginUser, getUserProfile, changePassword };
