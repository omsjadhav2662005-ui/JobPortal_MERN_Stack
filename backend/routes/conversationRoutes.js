const express = require('express');
const router = express.Router();
const {
  getConversations,
  getOrCreateConversation,
  sendMessage,
  markMessagesRead,
} = require('../controllers/conversationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getConversations)
  .post(protect, getOrCreateConversation);

router.route('/:id/messages')
  .post(protect, sendMessage);

router.route('/:id/read')
  .put(protect, markMessagesRead);

module.exports = router;