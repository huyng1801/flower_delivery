const express = require('express');
const router = express.Router();
const { register, login, refreshToken } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');

// POST /api/auth/register - Đăng ký
router.post('/register', validateRegister, register);

// POST /api/auth/login - Đăng nhập
router.post('/login', validateLogin, login);

// POST /api/auth/refresh-token - Làm mới token
router.post('/refresh-token', refreshToken);

module.exports = router;
