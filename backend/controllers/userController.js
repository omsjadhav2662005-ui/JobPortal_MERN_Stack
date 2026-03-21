const User = require('../models/User');

const safeUser = u => ({
  _id: u._id, name: u.name, email: u.email, role: u.role,
  profilePicture: u.profilePicture, headline: u.headline, about: u.about,
  phone: u.phone, location: u.location,
  skills: u.skills, certifications: u.certifications, socialLinks: u.socialLinks,
  education: u.education, experience: u.experience, resume: u.resume,
  appliedJobs: u.appliedJobs, savedJobs: u.savedJobs,
  connections: u.connections, connectionRequests: u.connectionRequests,
  notifications: u.notifications,
});

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    ['name','headline','about','phone','location','skills','certifications',
     'socialLinks','education','experience','savedJobs','connections'].forEach(f => {
      if (req.body[f] !== undefined) user[f] = req.body[f];
    });
    res.json(safeUser(await user.save()));
  } catch (e) { next(e); }
};

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search;
    // Exclude self from results only if logged in
    const selfExclude = req.user ? { _id: { $ne: req.user._id } } : {};
    const filter = search
      ? { ...selfExclude, $or: [{ name: { $regex: search, $options: 'i' } }, { headline: { $regex: search, $options: 'i' } }, { skills: { $in: [new RegExp(search,'i')] } }] }
      : { ...selfExclude };
    const users = await User.find(filter).select('-password -notifications -connectionRequests').limit(50);
    res.json(users);
  } catch (e) { next(e); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -notifications');
    if (!user) { res.status(404); throw new Error('User not found'); }
    res.json(user);
  } catch (e) { next(e); }
};

const sendConnectionRequest = async (req, res, next) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) { res.status(404); throw new Error('User not found'); }
    if (target._id.toString() === req.user._id.toString()) { res.status(400); throw new Error('Cannot connect with yourself'); }
    const alreadyConnected = target.connections.some(c => c.toString() === req.user._id.toString());
    const pendingRequest = target.connectionRequests.find(r => r.from.toString() === req.user._id.toString() && r.status === 'pending');
    if (alreadyConnected || pendingRequest) { res.status(400); throw new Error('Already connected or request pending'); }
    target.connectionRequests.push({ from: req.user._id, status: 'pending' });
    target.notifications.unshift({ message: `${req.user.name} sent you a connection request`, type: 'connection', link: '/network' });
    await target.save();
    res.json({ message: 'Connection request sent' });
  } catch (e) { next(e); }
};

const respondToConnection = async (req, res, next) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'
    const fromId = req.params.fromId;
    const user = await User.findById(req.user._id);
    const request = user.connectionRequests.find(r => r.from.toString() === fromId && r.status === 'pending');
    if (!request) { res.status(404); throw new Error('Request not found'); }
    request.status = action === 'accept' ? 'accepted' : 'rejected';
    if (action === 'accept') {
      if (!user.connections.some(c => c.toString() === fromId)) user.connections.push(fromId);
      await user.save();
      const sender = await User.findById(fromId);
      if (sender && !sender.connections.some(c => c.toString() === req.user._id.toString())) {
        sender.connections.push(req.user._id);
        sender.notifications.unshift({ message: `${user.name} accepted your connection request`, type: 'connection', link: '/network' });
        await sender.save();
      }
    } else { await user.save(); }
    res.json({ message: `Connection request ${action}ed` });
  } catch (e) { next(e); }
};

const removeConnection = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    await User.findByIdAndUpdate(req.user._id, { $pull: { connections: targetId } });
    await User.findByIdAndUpdate(targetId,     { $pull: { connections: req.user._id } });
    res.json({ message: 'Connection removed' });
  } catch (e) { next(e); }
};

const addNotification = async (req, res, next) => {
  try {
    const { message, type, link } = req.body;
    const user = await User.findById(req.user._id);
    user.notifications.unshift({ message, type: type || 'info', link, read: false });
    if (user.notifications.length > 50) user.notifications = user.notifications.slice(0, 50);
    await user.save();
    res.status(201).json(user.notifications);
  } catch (e) { next(e); }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.params.id === 'all') {
      user.notifications.forEach(n => { n.read = true; });
    } else {
      const n = user.notifications.id(req.params.id);
      if (n) n.read = true;
    }
    await user.save();
    res.json(user.notifications);
  } catch (e) { next(e); }
};

module.exports = { updateUserProfile, getUsers, getUserById, sendConnectionRequest, respondToConnection, removeConnection, addNotification, markNotificationRead };
