# 🌸 Flower Delivery - Ứng Dụng Bán Hoa Tươi Trực Tuyến

## 🎯 Giới Thiệu

**Flower Delivery** là một ứng dụng di động đa nền tảng cho phép người dùng duyệt, tìm kiếm và mua hoa tươi trực tuyến. Ứng dụng được xây dựng với công nghệ hiện đại, cung cấp trải nghiệm người dùng mượt mà và đơn giản.

## ✨ Tính Năng Chính

### Cho Người Dùng
- **Duyệt hoa**: Xem danh sách hoa theo danh mục với hình ảnh, giá, và mô tả
- **Tìm kiếm**: Tìm kiếm nhanh hoa theo tên, dịp phù hợp
- **Xem chi tiết**: Xem thông tin chi tiết về hoa (độ tươi, màu sắc, dịp phù hợp)
- **Giỏ hàng**: Thêm/xóa hoa, cập nhật số lượng
- **Đặt hàng**: Thanh toán đơn giản (hỗ trợ thanh toán khi nhận hàng)
- **Lịch sử đơn hàng**: Xem các đơn hàng đã đặt
- **Tài khoản cá nhân**: Quản lý thông tin cá nhân, địa chỉ giao hàng

## 🛠️ Công Nghệ Sử Dụng

### 1.1 Database: MongoDB (Local + MongoDB Node Driver)
Dự án sử dụng **MongoDB**, một cơ sở dữ liệu NoSQL hướng tài liệu (document-oriented). CSDL được cài đặt local trên máy phát triển, giúp đơn giản hóa quá trình phát triển mà không cần dịch vụ cloud.

Để tương tác với CSDL từ phía backend Node.js, đồ án sử dụng thư viện **mongodb** (cài từ npm) - đây chính là **Node.js Native Driver chính thức** của MongoDB. Lựa chọn này được ưu tiên thay vì các thư viện ODM (Object Data Modeling) như Mongoose, giúp có kiểm soát tốt hơn và hiệu năng cao hơn.

### 1.2 Backend: Node.js (Express.js)
**Node.js** được chọn làm nền tảng runtime cho backend nhờ:
- Hiệu năng cao
- Xử lý bất đồng bộ (Asynchronous)
- Non-blocking I/O

**Express.js** là một framework tối giản và linh hoạt của Node.js, giúp tổ chức và xây dựng các API một cách nhanh chóng và có cấu trúc rõ ràng.

### 1.3 Frontend: React Native + Expo
**React Native** được sử dụng để phát triển ứng dụng di động vì:
- Khả năng "Write once, run anywhere"
- Phát triển đồng thời trên cả iOS và Android
- Một codebase duy nhất, tiết kiệm thời gian và chi phí

**Expo** là nền tảng mã nguồn mở giúp:
- Đơn giản hóa quy trình phát triển, xây dựng và triển khai React Native
- Cung cấp Expo Go, Expo CLI, EAS Build
- Chạy thử ứng dụng trực tiếp trên thiết bị thật mà không cần cài đặt phức tạp (Android Studio, Xcode)
- Tăng tốc độ phát triển và dễ dàng chia sẻ bản demo

| Phần | Công Nghệ | Phiên Bản |
|------|-----------|----------|
| **Backend Runtime** | Node.js | 18.x+ |
| **Backend Framework** | Express.js | 4.18+ |
| **Database** | MongoDB (Local) | 4.4+ |
| **Database Driver** | mongodb (Node Driver) | 5.x+ |
| **Frontend Mobile** | React Native | 0.72+ |
| **Development Platform** | Expo | 49.x+ |
| **Quản lý State** | Redux Toolkit | 1.9+ |
| **HTTP Client** | Axios | 1.4+ |
| **Authentication** | JWT (JSON Web Tokens) | - |

## 📦 Cấu Trúc Dự Án

```
flower-delivery/
├── server/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection (mongodb driver)
│   │   ├── controllers/            # Business logic
│   │   ├── middleware/             # Authentication, validation, error handling
│   │   ├── routes/                 # API routes (Express)
│   │   ├── seed/                   # Seeding data
│   │   │   └── seedData.js        # Dữ liệu hoa mẫu
│   │   └── app.js                 # Express app setup
│   ├── .env                        # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                  # Entry point
│
├── mobile/                          # Frontend (React Native + Expo)
│   ├── src/
│   │   ├── navigation/            # React Navigation setup
│   │   ├── redux/
│   │   │   ├── slices/           # Redux slices (flowers, cart, user, orders)
│   │   │   └── store.js          # Redux store configuration
│   │   ├── screens/               # UI screens (Home, FlowerDetail, Cart, Orders, etc.)
│   │   ├── services/              # API calls (Axios)
│   │   └── App.js                # Entry point (Expo)
│   ├── app.json                  # Expo configuration
│   ├── .gitignore
│   ├── package.json
│   └── babel.config.js
│
└── README.md
```

## 🚀 Cài Đặt & Chạy Ứng Dụng

### Yêu Cầu Hệ Thống
- **Node.js** v18 trở lên
- **npm** hoặc **yarn**
- **MongoDB** (cài đặt local)
- **Expo CLI** (cài đặt toàn cầu: `npm install -g expo-cli`)
- **Expo Go app** trên thiết bị di động (iOS/Android) để test ứng dụng

**Lưu ý:** Không cần cài Android Studio hay Xcode vì sử dụng Expo

### Bước 1: Cài Đặt MongoDB Local

**Windows:**
```bash
# Tải installer từ https://www.mongodb.com/try/download/community
# Cài đặt MongoDB Community Server
# Sau khi cài đặt, MongoDB sẽ chạy tự động

# Kiểm tra MongoDB đã chạy
mongosh
```

**macOS (với Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Bước 2: Clone & Setup Backend

```bash
# Vào thư mục server
cd server

# Cài đặt dependencies
npm install

# Tạo file .env
# Windows (cmd):
echo MONGODB_URI=mongodb://localhost:27017/bookstore > .env
echo JWT_SECRET=your_super_secret_key_here >> .env
echo PORT=3000 >> .env

# hoặc tạo file .env bằng text editor với nội dung:
# MONGODB_URI=mongodb://localhost:27017/bookstore
# JWT_SECRET=your_super_secret_key_here
# PORT=3000

# Chạy server
npm start
```

**Server sẽ chạy tại:** `http://localhost:3000`

### Bước 3: Setup Frontend (React Native + Expo)

```bash
# Vào thư mục mobile
cd mobile

# Cài đặt Expo CLI (nếu chưa cài)
npm install -g expo-cli

# Cài đặt dependencies
npm install

# Bắt đầu Expo dev server
npm start
# hoặc
expo start

# Sau khi terminal xuất hiện QR code:
# - Scan QR code bằng Expo Go app (iOS/Android)
# - Hoặc nhấn 'i' để chạy iOS simulator (macOS only)
# - Hoặc nhấn 'a' để chạy Android emulator
```

**Lưu ý Expo:**
- Cài Expo Go app từ App Store (iOS) hoặc Google Play (Android)
- Scan QR code từ terminal để test ứng dụng trực tiếp
- Không cần build APK/IPA trong quá trình phát triển

## 📱 Hướng Dẫn Sử Dụng

### Người Dùng Thường
1. **Mở ứng dụng** → Trang chủ hiển thị danh sách sách
2. **Duyệt sách** → Cuộn danh sách hoặc dùng bộ lọc theo danh mục
3. **Tìm kiếm** → Nhập tiêu đề/tác giả sách muốn tìm
4. **Xem chi tiết** → Nhấn sách để xem thông tin đầy đủ
5. **Thêm vào giỏ** → Nhấn nút "Thêm vào giỏ hàng"
6. **Thanh toán** → Vào giỏ hàng → Nhấn "Đặt hàng" → Nhập địa chỉ → Xác nhận

### Tài Khoản
- **Đăng ký**: Nhập email, password
- **Đăng nhập**: Sử dụng email/password
- **Quên mật khẩu**: Nhấn "Quên mật khẩu" → Nhập email → Đặt lại mật khẩu

## 🔌 API Endpoints (Backend)

### Hoa
- `GET /api/flowers` - Lấy danh sách hoa
- `GET /api/flowers/:id` - Lấy chi tiết hoa
- `GET /api/flowers/search?q=keyword` - Tìm kiếm hoa
- `GET /api/flowers?category=categoryName` - Lọc hoa theo danh mục

### Đơn Hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `GET /api/orders` - Lấy danh sách đơn hàng (user)
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng

### Xác Thực
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh-token` - Làm mới token

### Người Dùng
- `GET /api/users/profile` - Lấy thông tin cá nhân
- `PUT /api/users/profile` - Cập nhật thông tin cá nhân

## 🗄️ Database Schema

### Collections

**flowers**
```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  price: Number,
  description: String,
  image: String (URL),
  quantity: Number,
  rating: Number (0-5),
  freshnessDays: Number,
  colors: [String],
  occasions: [String],
  createdAt: Date
}
```

**users**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  fullName: String,
  phone: String,
  address: String,
  createdAt: Date
}
```

**orders**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  items: [
    {
      flowerId: ObjectId,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      category: String,
      freshnessDays: Number
    }
  ],
  totalPrice: Number,
  status: String (pending/processing/shipped/delivered/cancelled),
  shippingAddress: String,
  phone: String,
  createdAt: Date
}
```

## 🔒 Bảo Mật

- **Password**: Được mã hóa bằng bcrypt
- **JWT**: Token hết hạn sau 24 giờ
- **Validation**: Kiểm tra input trên client và server
- **HTTPS**: Khuyến nghị sử dụng trên production

## 📊 Biến Môi Trường (.env)

**File: `server/.env`**
```env
# MongoDB (Local)
MONGODB_URI=mongodb://localhost:27017/flower-delivery

# JWT Authentication
JWT_SECRET=your_super_secret_key_here_change_this_in_production
JWT_EXPIRE=24h

# Server
PORT=3000
NODE_ENV=development
```

**Lưu ý:** 
- Thay `your_super_secret_key_here_change_this_in_production` bằng một secret key mạnh
- Trong production, sử dụng biến môi trường thực từ process.env hoặc secret manager

## 🧪 Testing

```bash
# Backend - chạy unit tests (nếu setup Jest)
cd server
npm run test

# Frontend - chạy tests (nếu setup Jest)
cd mobile
npm run test

# Backend - linting & code quality
cd server
npm run lint

# Frontend - linting
cd mobile
npm run lint
```

## 📈 Performance & Optimization

### Backend (Node.js + Express + MongoDB)
- **Connection Pooling**: MongoDB driver sử dụng connection pool mặc định
- **Indexing**: Tạo indexes trên MongoDB cho các trường thường xuyên query
- **Pagination**: API trả về dữ liệu phân trang (limit, offset)
- **Caching**: Cache response tạm thời (optional)

### Frontend (React Native + Expo)
- **State Management**: Redux Toolkit để manage state hiệu quả
- **Image Optimization**: Nén hình ảnh trước upload
- **Lazy Loading**: Tải danh sách sách theo pagination
- **Memoization**: React.memo, useMemo để tránh re-render không cần thiết

### Deployment (Optional)
- **Backend**: Deploy lên Heroku, Railway, Render, VPS
- **Mobile**: Build APK/IPA qua EAS Build (Expo)

## 🐛 Troubleshooting

### MongoDB không kết nối
```bash
# Kiểm tra MongoDB đã chạy
mongosh

# Nếu lỗi "command not found", MongoDB chưa được cài đặt
# Xem phần "Bước 1: Cài Đặt MongoDB Local" để cài đặt

# Windows - Khởi động MongoDB Service
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Kết nối từ backend đến MongoDB lỗi
```bash
# Kiểm tra MONGODB_URI trong file .env
# Mặc định: mongodb://localhost:27017/bookstore

# Kiểm tra port MongoDB (mặc định 27017)
netstat -an | findstr 27017  # Windows
lsof -i :27017               # macOS/Linux
```

### React Native / Expo lỗi
```bash
# Xóa node_modules và cài lại
cd mobile
rm -rf node_modules package-lock.json
npm install

# Xóa cache Expo
expo start --clear

# Cập nhật Expo CLI
npm install -g expo-cli@latest
```

### Lỗi "Cannot find module 'mongodb'"
```bash
# Cài lại dependencies backend
cd server
npm install
npm install mongodb  # Cài thêm nếu cần
```

### Port 3000 đang được sử dụng
```bash
# Thay đổi PORT trong file .env
PORT=3001

# Hoặc kill process đang dùng port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

## 📋 Dependencies Chính

### Backend (server/package.json)
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongodb": "^5.0.0",
    "dotenv": "^16.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.0.0",
    "cors": "^2.8.5",
    "body-parser": "^1.20.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

### Frontend (mobile/package.json)
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-native": "^0.72.0",
    "expo": "^49.0.0",
    "@react-navigation/native": "^6.0.0",
    "@react-navigation/bottom-tabs": "^6.0.0",
    "@react-navigation/stack": "^6.0.0",
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.0.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  }
}
```

## 📝 Commit Convention

```
feat: Thêm tính năng mới
fix: Sửa lỗi
docs: Cập nhật tài liệu
style: Thay đổi style (không ảnh hưởng logic)
refactor: Tái cấu trúc code
test: Thêm/cập nhật tests
chore: Cập nhật dependencies
```

## 📄 License

MIT License - Tự do sử dụng và phân phối

## 👥 Contributors

- **Project Lead**: Team Development
- **Backend**: Node.js Developer
- **Frontend**: React Native Developer

## 📧 Liên Hệ & Support

- **Email**: support@bookstore.com
- **Website**: https://bookstore.com
- **Issues**: GitHub Issues

---

**Phiên bản**: 1.0.0  
**Stack**: Node.js + MongoDB + React Native + Expo  
**Cập nhật lần cuối**: December 17, 2025

## 🌱 Seed Data (Dữ liệu mẫu thực tế)

Về dữ liệu hoa mẫu đặc sắc của Việt Nam cho MongoDB, file `src/seed/seedData.js` đã có sẵn trong thư mục backend:

### Những sắc hoa được bao gồm:
- **Hương dương**: Thể hiện độc lập và hỷ
- **Hoa hồng**: Tương trưng cho tình yêu
- **Hoa lâu**: Dễ hàng, phù hợp các dịp
- **Hoa biểu tượng**: Phù hợp sự kính trọng
- **Các loại hoa hợp**

**Chạy seed:**
```bash
cd server
node src/seed/seedData.js
```

Dữ liệu hoa thực việc sẽ tự động được độc vào MongoDB.

---

## 🌐 Giao Diện Tiếng Việt

- Toàn bộ giao diện web/mobile, thông báo, label, placeholder đều sử dụng tiếng Việt.
- Đảm bảo trải nghiệm người dùng Việt Nam thân thiện, dễ hiểu.
