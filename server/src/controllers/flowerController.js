const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

/**
 * Lấy danh sách hoa (có hỗ trợ pagination và filter)
 */
async function getAllFlowers(req, res) {
  try {
    const db = getDB();
    const { category, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const flowers = await db.collection('flowers')
      .find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection('flowers').countDocuments(filter);

    res.json({
      success: true,
      message: 'Lấy danh sách hoa thành công',
      data: {
        flowers,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Lỗi getAllFlowers:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách hoa'
    });
  }
}

/**
 * Lấy chi tiết một bông hoa
 */
async function getFlowerById(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID hoa không hợp lệ'
      });
    }

    const flower = await db.collection('flowers').findOne({ _id: new ObjectId(id) });

    if (!flower) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hoa'
      });
    }

    res.json({
      success: true,
      message: 'Lấy chi tiết hoa thành công',
      data: flower
    });
  } catch (error) {
    console.error('Lỗi getFlowerById:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết hoa'
    });
  }
}

/**
 * Tìm kiếm hoa (theo tên hoặc mô tả)
 */
async function searchFlowers(req, res) {
  try {
    const db = getDB();
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập từ khóa tìm kiếm'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Tìm kiếm text search hoặc regex
    const flowers = await db.collection('flowers')
      .find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ]
      })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection('flowers').countDocuments({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    });

    res.json({
      success: true,
      message: 'Tìm kiếm thành công',
      data: {
        flowers,
        query: q,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Lỗi searchFlowers:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm hoa'
    });
  }
}

/**
 * Lấy danh sách danh mục hoa
 */
async function getCategories(req, res) {
  try {
    const db = getDB();
    
    const categories = await db.collection('flowers')
      .distinct('category');

    res.json({
      success: true,
      message: 'Lấy danh mục thành công',
      data: categories
    });
  } catch (error) {
    console.error('Lỗi getCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh mục'
    });
  }
}

/**
 * Lấy hoa theo dịp đặc biệt
 */
async function getFlowersByOccasion(req, res) {
  try {
    const db = getDB();
    const { occasion } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const flowers = await db.collection('flowers')
      .find({ 
        $or: [
          { occasions: { $in: [occasion] } },
          { occasions: { $regex: occasion, $options: 'i' } }
        ]
      })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection('flowers').countDocuments({
      $or: [
        { occasions: { $in: [occasion] } },
        { occasions: { $regex: occasion, $options: 'i' } }
      ]
    });

    res.json({
      success: true,
      message: `Lấy hoa cho dịp ${occasion} thành công`,
      data: {
        flowers,
        occasion,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Lỗi getFlowersByOccasion:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy hoa theo dịp'
    });
  }
}

/**
 * Lấy hoa bán chạy nhất
 */
async function getBestSellingFlowers(req, res) {
  try {
    const db = getDB();
    const { limit = 10 } = req.query;

    // Lấy hoa có rating cao nhất và quantity bán được nhiều
    const flowers = await db.collection('flowers')
      .find()
      .sort({ rating: -1, soldCount: -1 })
      .limit(parseInt(limit))
      .toArray();

    res.json({
      success: true,
      message: 'Lấy hoa bán chạy thành công',
      data: flowers
    });
  } catch (error) {
    console.error('Lỗi getBestSellingFlowers:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy hoa bán chạy'
    });
  }
}

/**
 * Lấy hoa mới nhất
 */
async function getNewFlowers(req, res) {
  try {
    const db = getDB();
    const { limit = 10 } = req.query;

    const flowers = await db.collection('flowers')
      .find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .toArray();

    res.json({
      success: true,
      message: 'Lấy hoa mới nhất thành công',
      data: flowers
    });
  } catch (error) {
    console.error('Lỗi getNewFlowers:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy hoa mới nhất'
    });
  }
}

module.exports = {
  getAllFlowers,
  getFlowerById,
  searchFlowers,
  getCategories,
  getFlowersByOccasion,
  getBestSellingFlowers,
  getNewFlowers
};