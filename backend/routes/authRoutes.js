const express = require('express');
const router = express.Router();
const { login, loginWithToken, signup } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me (protected route)
router.get('/me', authMiddleware, loginWithToken);

// POST /api/auth/signup
router.post('/signup', signup);

module.exports = router;