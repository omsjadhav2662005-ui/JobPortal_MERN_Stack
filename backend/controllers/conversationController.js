const Conversation = require('../models/Conversation');
const User = require('../models/User');

const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email profilePicture headline')
      .populate('messages.from', 'name email profilePicture')
      .sort('-updatedAt');
    res.json(conversations);
  } catch (e) { next(e); }
};

const getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    if (!recipientId) { res.status(400); throw new Error('recipientId required'); }
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
    })
      .populate('participants', 'name email profilePicture headline')
      .populate('messages.from', 'name email profilePicture');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
        messages: [],
      });
      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email profilePicture headline')
        .populate('messages.from', 'name email profilePicture');
    }
    res.json(conversation);
  } catch (e) { next(e); }
};

const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) { res.status(400); throw new Error('Message text required'); }
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) { res.status(404); throw new Error('Conversation not found'); }
    if (!conversation.participants.map(p => p.toString()).includes(req.user._id.toString())) {
      res.status(403); throw new Error('Not authorized');
    }
    conversation.messages.push({ from: req.user._id, text, read: false });
    conversation.updatedAt = Date.now();
    await conversation.save();
    const updatedConv = await Conversation.findById(conversation._id)
      .populate('participants', 'name email profilePicture headline')
      .populate('messages.from', 'name email profilePicture');
    res.json(updatedConv);
  } catch (e) { next(e); }
};

const markMessagesRead = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) { res.status(404); throw new Error('Conversation not found'); }
    conversation.messages.forEach(msg => {
      if (msg.from.toString() !== req.user._id.toString()) {
        msg.read = true;
      }
    });
    await conversation.save();
    res.json({ message: 'Messages marked as read' });
  } catch (e) { next(e); }
};

module.exports = { getConversations, getOrCreateConversation, sendMessage, markMessagesRead };