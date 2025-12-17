/**
 * Middleware xử lý lỗi toàn cục
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Lỗi:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi server';

  res.status(statusCode).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;
