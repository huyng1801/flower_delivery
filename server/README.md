# 🌸 Fresh Flower Delivery Backend API

Backend API cho ứng dụng giao hoa tươi - Node.js + Express + MongoDB

## 🚀 Bắt đầu

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình môi trường
Tạo file `.env` trong thư mục `server`:
```env
MONGODB_URI=mongodb://localhost:27017/flower_delivery
JWT_SECRET=flower_delivery_super_secret_key_2025_change_in_production
JWT_EXPIRE=24h
PORT=3000
NODE_ENV=development
```

### 3. Seed dữ liệu (Tiếng Việt)
```bash
npm run seed
```
Lệnh này sẽ thêm 25+ loại hoa tươi thực tế bằng tiếng Việt vào database.

### 4. Chạy server
```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh-token` - Làm mới token

### Flowers
- `GET /api/flowers` - Lấy danh sách hoa (có pagination, filter)
- `GET /api/flowers/:id` - Lấy chi tiết hoa
- `GET /api/flowers/search?q=keyword` - Tìm kiếm hoa
- `GET /api/flowers/categories` - Lấy danh sách danh mục hoa
- `GET /api/flowers/best-selling` - Lấy hoa bán chạy nhất
- `GET /api/flowers/new` - Lấy hoa mới nhất
- `GET /api/flowers/occasion/:occasion` - Lấy hoa theo dịp

### Orders (Cần authentication)
- `POST /api/orders` - Tạo đơn hàng mới
- `GET /api/orders` - Lấy danh sách đơn hàng của user
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng

### Users (Cần authentication)
- `GET /api/users/profile` - Lấy thông tin profile
- `PUT /api/users/profile` - Cập nhật profile
- `POST /api/users/change-password` - Đổi mật khẩu

## 🔑 Test Account
Sau khi chạy seed, bạn có thể đăng nhập với:
- **Email**: customer1@example.com
- **Password**: 123456

## 📁 Cấu trúc thư mục
```
server/
├── src/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/             # Business logic
│   │   ├── authController.js
│   │   ├── flowerController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── middleware/              # Express middleware
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── routes/                  # API routes
│   │   ├── authRoutes.js
│   │   ├── flowerRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── seed/                    # Seed data
│   │   └── seedData.js
│   └── app.js                   # Express app
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── server.js                    # Entry point
```

## 🧪 Test API với curl

### Đăng ký
```bash
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"123456\",\"fullName\":\"Nguyen Thi Hoa\"}"
```

### Đăng nhập
```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"customer1@example.com\",\"password\":\"123456\"}"
```

### Lấy danh sách hoa
```bash
curl http://localhost:3000/api/flowers
```

### Tìm kiếm hoa
```bash
curl "http://localhost:3000/api/flowers/search?q=hồng"
```

### Lấy hoa theo dịp
```bash
curl "http://localhost:3000/api/flowers/occasion/Valentine"
```

## 📊 Dữ liệu Seed
File seed bao gồm:
- **25+ loại hoa tươi** thực tế bằng tiếng Việt
- Danh mục: Hoa hồng, Hoa cúc, Hoa ly, Hoa tulip, Hoa cẩm chướng, Hoa đồng tiền, Hoa baby, Hoa hướng dương, Hoa lan, Lá salem
- Thông tin chi tiết: Giá, độ tươi, dịp phù hợp, màu sắc
- **2 users** mẫu để test

## 🔒 Bảo mật
- Password được hash bằng bcrypt
- JWT token hết hạn sau 24 giờ
- Middleware xác thực cho các routes cần bảo vệ
- Validation input từ client

## 🛠️ Technologies
- **Node.js** v18+
- **Express.js** v4.18+
- **MongoDB** (Native Driver) v5+
- **JWT** for authentication
- **bcrypt** for password hashing

## 🌸 Tính năng đặc biệt
- Tìm kiếm hoa theo tên, mô tả, danh mục
- Lọc hoa theo dịp đặc biệt (Valentine, đám cưới, sinh nhật...)
- Theo dõi độ tươi của hoa (freshnessDays)
- Thống kê hoa bán chạy
- Hệ thống đánh giá và rating
