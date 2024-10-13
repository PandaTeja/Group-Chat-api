const Group = require('../models/group');
const User = require('../models/user');

exports.createGroup = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id; 

    if (!name) {
        return res.status(400).json({ message: 'Group name is required' });
    }

    try {
        const group = new Group({ name, members: [userId] }); 
        await group.save();
        res.status(201).json({ group }); 
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addMember = async (req, res) => {
    const { groupId, userId } = req.body;

    // Check if groupId and userId are provided
    if (!groupId || !userId) {
        return res.status(400).json({ message: 'Group ID and User ID are required' });
    }

    try {
        const group = await Group.findById(groupId);
        const user = await User.findById(userId);

        // Check if group and user exist
        if (!group || !user) {
            return res.status(404).json({ message: 'Group or User not found' });
        }

        // Check if the user is already a member of the group
        if (group.members.includes(user._id)) {
            return res.status(400).json({ message: 'User is already a member of the group' });
        }

        group.members.push(user._id); // Push the user's ObjectId
        await group.save();
        res.json({ group }); // Return the updated group object
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteGroup = async (req, res) => {
    const { id } = req.params;

    try {
        const group = await Group.findByIdAndDelete(id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.searchGroups = async (req, res) => {
    const { name } = req.query;

    try {
        const groups = await Group.find({ name: { $regex: name, $options: 'i' } });
        res.status(200).json({ groups });
    } catch (error) {
        console.error('Error searching groups:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
