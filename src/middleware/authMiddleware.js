const jwt = require('jsonwebtoken'); // Ensure this line is present

exports.authAdminMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};
exports.authUserMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'user') {
            return res.status(403).json({ message: 'Forbidden: users only' });
        }
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};
