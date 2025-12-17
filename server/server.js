require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// Kết nối MongoDB
connectDB()
  .then(() => {
    // Khởi động server
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      console.log(`📚 BookStore API - Node.js + Express + MongoDB`);
      console.log(`🌍 Môi trường: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('❌ Lỗi kết nối database:', error);
    process.exit(1);
  });

// Xử lý unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});
