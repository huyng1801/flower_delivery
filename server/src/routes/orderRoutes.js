const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateOrder } = require('../middleware/validation');

// Tất cả routes cần authentication
router.use(authMiddleware);

// POST /api/orders - Tạo đơn hàng mới
router.post('/', validateOrder, createOrder);

// GET /api/orders - Lấy danh sách đơn hàng của user
router.get('/', getUserOrders);

// GET /api/orders/:id - Lấy chi tiết đơn hàng
router.get('/:id', getOrderById);

module.exports = router;
