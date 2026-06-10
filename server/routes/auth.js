const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, logout, refresh, getMe, loginValidation } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Strict rate limit on login — 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
});

// More lenient limit on refresh
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { message: 'Too many requests' },
});

router.post('/login', loginLimiter, loginValidation, login);
router.post('/logout', protect, logout);
router.post('/refresh', refreshLimiter, refresh);
router.get('/me', protect, getMe);

module.exports = router;
