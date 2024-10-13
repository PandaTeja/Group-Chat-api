const express = require('express');
const { createGroup, addMember, deleteGroup, searchGroups } = require('../controllers/groupController');
const {authUserMiddleware} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authUserMiddleware, createGroup);
router.post('/add-member', authUserMiddleware, addMember);
router.delete('/:id', authUserMiddleware, deleteGroup);
router.get('/', authUserMiddleware, searchGroups); 

module.exports = router;
