const Message = require('../models/message');

exports.sendMessage = async (req, res) => {
    const { text, groupId } = req.body;


    if (!text || !groupId) {
        return res.status(400).json({ message: 'Text and Group ID are required' });
    }

    try {
        const message = new Message({ text, user: req.user.id, group: groupId });
        await message.save();
        res.status(201).json({ message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.likeMessage = async (req, res) => {
    const { messageId } = req.body;


    if (!messageId) {
        return res.status(400).json({ message: 'Message ID is required' });
    }

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (!message.likes.includes(req.user.id)) {
            message.likes.push(req.user.id);
        }

        await message.save();
        res.json({ message,'message': 'Message liked successfully' });
    } catch (error) {
        console.error('Error liking message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMessagesByGroup = async (req, res) => {
    const { groupId } = req.params;

    if (!groupId) {
        return res.status(400).json({ message: 'Group ID is required' });
    }

    try {
        const messages = await Message.find({ group: groupId })
            .populate('user', 'username') 
            .sort({ createdAt: -1 }); 

        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

