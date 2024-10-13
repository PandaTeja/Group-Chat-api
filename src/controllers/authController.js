const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

exports.register = async (req, res) => {
    const { username, password,role } = req.body;

    try {
        const newUser = new User({ username, password,role }); 
        resp=await newUser.save();
        res.status(201).json({ resp,message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateUser = async (req, res) => {
    const { userId, newDetails } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, newDetails, { new: true });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.body;

    try {
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
