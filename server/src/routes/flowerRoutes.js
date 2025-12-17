const express = require('express');
const router = express.Router();
const {
  getAllFlowers,
  getFlowerById,
  searchFlowers,
  getCategories,
  getFlowersByOccasion,
  getBestSellingFlowers,
  getNewFlowers
} = require('../controllers/flowerController');

// GET /api/flowers - Lấy danh sách hoa
router.get('/', getAllFlowers);

// GET /api/flowers/search - Tìm kiếm hoa
router.get('/search', searchFlowers);

// GET /api/flowers/categories - Lấy danh sách danh mục
router.get('/categories', getCategories);

// GET /api/flowers/best-selling - Lấy hoa bán chạy nhất
router.get('/best-selling', getBestSellingFlowers);

// GET /api/flowers/new - Lấy hoa mới nhất
router.get('/new', getNewFlowers);

// GET /api/flowers/occasion/:occasion - Lấy hoa theo dịp
router.get('/occasion/:occasion', getFlowersByOccasion);

// GET /api/flowers/:id - Lấy chi tiết hoa
router.get('/:id', getFlowerById);

module.exports = router;