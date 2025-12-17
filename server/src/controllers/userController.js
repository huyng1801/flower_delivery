const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

/**
 * Lấy thông tin profile của user
 */
async function getProfile(req, res) {
  try {
    const db = getDB();
    const userId = req.user.userId;

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.json({
      success: true,
      message: 'Lấy thông tin thành công',
      data: user
    });
  } catch (error) {
    console.error('Lỗi getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin người dùng'
    });
  }
}

/**
 * Cập nhật thông tin profile
 */
async function updateProfile(req, res) {
  try {
    const db = getDB();
    const userId = req.user.userId;
    const { fullName, phone, address } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có thông tin để cập nhật'
      });
    }

    updateData.updatedAt = new Date();

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: updateData
    });
  } catch (error) {
    console.error('Lỗi updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thông tin'
    });
  }
}

/**
 * Đổi mật khẩu
 */
async function changePassword(req, res) {
  try {
    const db = getDB();
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu cũ không đúng'
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Lỗi changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đổi mật khẩu'
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};
