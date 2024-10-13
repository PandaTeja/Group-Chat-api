const express = require('express');
const { register, login,updateUser,deleteUser } = require('../controllers/authController');
const { authAdminMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/register', authAdminMiddleware,register);

router.post('/login', login);
router.put('/update', authAdminMiddleware, updateUser);
router.delete('/delete', authAdminMiddleware, deleteUser); 

module.exports = router;