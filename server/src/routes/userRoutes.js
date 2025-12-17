const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Tất cả routes cần authentication
router.use(authMiddleware);

// GET /api/users/profile - Lấy thông tin profile
router.get('/profile', getProfile);

// PUT /api/users/profile - Cập nhật profile
router.put('/profile', updateProfile);

// POST /api/users/change-password - Đổi mật khẩu
router.post('/change-password', changePassword);

module.exports = router;
