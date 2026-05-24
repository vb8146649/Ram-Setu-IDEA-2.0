// AI Route: POST /ai/chat and /ai/voice
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticate } = require('../middleware/auth');
const { chat, voiceChat } = require('../controllers/aiController');

// Multer setup for temporary audio file storage
const upload = multer({ dest: 'uploads/' });

router.post('/chat', authenticate, chat);
router.post('/voice', authenticate, upload.single('audio'), voiceChat);

module.exports = router;
