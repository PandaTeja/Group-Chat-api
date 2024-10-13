const express = require('express');
const { sendMessage, likeMessage, getMessagesByGroup,unlikeMessage } = require('../controllers/messageController');
const {authUserMiddleware} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/send', authUserMiddleware, sendMessage);
router.post('/like', authUserMiddleware, likeMessage);
router.get('/:groupId', authUserMiddleware, getMessagesByGroup);

module.exports = router;
