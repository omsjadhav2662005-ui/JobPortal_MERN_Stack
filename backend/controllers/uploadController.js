const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const uploadProfilePic = async (req, res, next) => {
  try {
    if (!req.file) { res.status(400); throw new Error('No file uploaded'); }
    const user = await User.findById(req.user._id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldPath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    const filePath = `/uploads/${req.file.filename}`;
    user.profilePicture = filePath;
    await user.save();
    res.json({ profilePicture: filePath });
  } catch (e) { next(e); }
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) { res.status(400); throw new Error('No file uploaded'); }
    const user = await User.findById(req.user._id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    // Delete old resume if exists
    if (user.resume?.path) {
      const oldPath = path.join(__dirname, '..', user.resume.path);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    const filePath = `/uploads/${req.file.filename}`;
    user.resume = { name: req.file.originalname, path: filePath };
    await user.save();
    res.json(user.resume);
  } catch (e) { next(e); }
};

module.exports = { uploadProfilePic, uploadResume };