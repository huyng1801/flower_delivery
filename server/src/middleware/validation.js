/**
 * Validation cho đăng ký
 */
function validateRegister(req, res, next) {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng điền đầy đủ thông tin'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Email không hợp lệ'
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Mật khẩu phải có ít nhất 6 ký tự'
    });
  }

  next();
}

/**
 * Validation cho đăng nhập
 */
function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập email và mật khẩu'
    });
  }

  next();
}

/**
 * Validation cho tạo đơn hàng
 */
function validateOrder(req, res, next) {
  const { items, shippingAddress } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Giỏ hàng trống'
    });
  }

  if (!shippingAddress) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập địa chỉ giao hàng'
    });
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateOrder
};
