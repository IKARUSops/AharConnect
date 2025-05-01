const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
// const { logout } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

// router.post('/logout', authMiddleware, logout);

module.exports = router;
