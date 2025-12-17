const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore';
const client = new MongoClient(uri);

let db = null;

/**
 * Kết nối đến MongoDB
 */
async function connectDB() {
  try {
    await client.connect();
    db = client.db();
    console.log('✅ Kết nối MongoDB thành công!');
    
    // Tạo indexes để tối ưu performance
    await createIndexes();
    
    return db;
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    throw error;
  }
}

/**
 * Tạo indexes cho các collections
 */
async function createIndexes() {
  try {
    // Index cho books collection
    await db.collection('books').createIndex({ title: 'text', author: 'text' });
    await db.collection('books').createIndex({ category: 1 });
    
    // Index cho users collection
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    // Index cho orders collection
    await db.collection('orders').createIndex({ userId: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });
    
    console.log('✅ Tạo indexes thành công!');
  } catch (error) {
    console.error('⚠️ Lỗi khi tạo indexes:', error.message);
  }
}

/**
 * Lấy instance của database
 */
function getDB() {
  if (!db) {
    throw new Error('Database chưa được kết nối!');
  }
  return db;
}

/**
 * Đóng kết nối database
 */
async function closeDB() {
  await client.close();
  console.log('🔒 Đã đóng kết nối MongoDB');
}

module.exports = {
  connectDB,
  getDB,
  closeDB
};
