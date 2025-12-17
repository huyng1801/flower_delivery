const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

/**
 * Đăng ký tài khoản mới
 */
async function register(req, res) {
  try {
    const { email, password, fullName, phone, address } = req.body;
    const db = getDB();

    // Kiểm tra email đã tồn tại
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = {
      email,
      password: hashedPassword,
      fullName,
      phone: phone || '',
      address: address || '',
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);

    // Tạo JWT token
    const token = jwt.sign(
      { userId: result.insertedId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        token,
        user: {
          id: result.insertedId,
          email,
          fullName
        }
      }
    });
  } catch (error) {
    console.error('Lỗi register:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký'
    });
  }
}

/**
 * Đăng nhập
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const db = getDB();

    // Tìm user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName
        }
      }
    });
  } catch (error) {
    console.error('Lỗi login:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập'
    });
  }
}

/**
 * Refresh token
 */
async function refreshToken(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token không được cung cấp'
      });
    }

    // Verify old token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

    // Tạo token mới
    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({
      success: true,
      message: 'Làm mới token thành công',
      data: { token: newToken }
    });
  } catch (error) {
    console.error('Lỗi refresh token:', error);
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ'
    });
  }
}

module.exports = {
  register,
  login,
  refreshToken
};
