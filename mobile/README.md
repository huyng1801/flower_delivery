# 🌸 Flower Delivery Mobile App - React Native + Expo

Ứng dụng mobile giao hoa tươi trực tuyến được xây dựng bằng React Native và Expo, kết nối với backend Node.js + MongoDB.

## 🚀 Công nghệ sử dụng

- **React Native**: 0.72.6
- **Expo**: ~50.0.0
- **Redux Toolkit**: 2.0.0 (Quản lý state)
- **React Navigation**: 6.x (Điều hướng)
- **Axios**: 1.6.2 (HTTP client)
- **AsyncStorage**: Lưu trữ local (token, giỏ hàng)

## 📋 Tính năng

### 🔐 Xác thực
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập
- ✅ Tự động lưu token và khôi phục phiên đăng nhập
- ✅ Đăng xuất

### 🌺 Quản lý hoa tươi
- ✅ Xem danh sách hoa với phân trang
- ✅ Lọc theo danh mục (hoa cưới, sinh nhật, tình yêu...)
- ✅ Tìm kiếm hoa theo tên
- ✅ Xem chi tiết hoa
- ✅ Hiển thị độ tươi (ngày)
- ✅ Hiển thị số lượng còn lại
- ✅ Hiển thị occasions phù hợp

### 🛒 Giỏ hàng
- ✅ Thêm hoa vào giỏ hàng
- ✅ Cập nhật số lượng
- ✅ Xóa hoa khỏi giỏ hàng
- ✅ Lưu giỏ hàng local
- ✅ Tính tổng tiền tự động

### 📦 Đơn hàng
- ✅ Đặt hàng với địa chỉ và SĐT
- ✅ Xem lịch sử đơn hàng
- ✅ Xem chi tiết đơn hàng
- ✅ Hiển thị trạng thái đơn hàng

### 👤 Tài khoản
- ✅ Xem và chỉnh sửa thông tin cá nhân
- ✅ Đổi mật khẩu
- ✅ Đăng xuất

## 📁 Cấu trúc thư mục

```
mobile/
├── App.js                      # Entry point chính
├── app.json                    # Cấu hình Expo
├── package.json                # Dependencies
├── babel.config.js             # Babel config
└── src/
    ├── navigation/
    │   └── AppNavigator.js     # Cấu hình navigation
    ├── screens/
    │   ├── LoginScreen.js      # Màn hình đăng nhập
    │   ├── RegisterScreen.js   # Màn hình đăng ký
    │   ├── HomeScreen.js       # Trang chủ - danh sách sách
    │   ├── BookDetailScreen.js # Chi tiết sách
    │   ├── CartScreen.js       # Giỏ hàng
    │   ├── OrdersScreen.js     # Danh sách đơn hàng
    │   ├── OrderDetailScreen.js# Chi tiết đơn hàng
    │   └── ProfileScreen.js    # Tài khoản
    ├── redux/
    │   ├── store.js            # Redux store
    │   └── slices/
    │       ├── authSlice.js    # Auth state
    │       ├── bookSlice.js    # Books state
    │       ├── cartSlice.js    # Cart state
    │       └── orderSlice.js   # Orders state
    └── services/
        ├── api.js              # Axios instance
        ├── authService.js      # Auth API calls
        ├── bookService.js      # Book API calls
        ├── orderService.js     # Order API calls
        └── userService.js      # User API calls
```

## 🛠️ Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
cd mobile
npm install
```

### 2. Cấu hình API URL

Mở file `src/services/api.js` và cập nhật `API_BASE_URL`:

```javascript
// Cho emulator/simulator (localhost)
const API_BASE_URL = 'http://localhost:3000/api';

// Cho thiết bị thật (thay YOUR_IP bằng IP máy tính)
const API_BASE_URL = 'http://192.168.1.x:3000/api';
```

**Lấy IP máy tính:**
- Windows: `ipconfig` → tìm IPv4 Address
- Mac/Linux: `ifconfig` hoặc `ip addr` → tìm inet

### 3. Chạy ứng dụng

```bash
# Khởi động Expo
npm start

# hoặc
npx expo start
```

Sau đó chọn:
- `a` - Chạy trên Android emulator
- `i` - Chạy trên iOS simulator
- Quét QR code bằng Expo Go app trên điện thoại thật

## 📱 Hướng dẫn sử dụng

### Đăng nhập với tài khoản demo

```
Email: user1@example.com
Mật khẩu: 123456
```

### Hoặc đăng ký tài khoản mới

1. Nhấn "Đăng ký ngay" ở màn hình đăng nhập
2. Điền thông tin (tên, email, mật khẩu là bắt buộc)
3. Nhấn "Đăng ký"

### Mua sách

1. Duyệt danh sách sách ở trang chủ
2. Tìm kiếm hoặc lọc theo danh mục
3. Nhấn vào sách để xem chi tiết
4. Nhấn "Thêm vào giỏ" để thêm vào giỏ hàng
5. Vào tab "Giỏ Hàng" để xem và điều chỉnh
6. Nhập địa chỉ và SĐT, nhấn "Đặt hàng"
7. Xem đơn hàng tại tab "Đơn Hàng"

## 🔧 Yêu cầu hệ thống

- Node.js 18.x trở lên
- npm hoặc yarn
- Expo CLI (tự động cài khi chạy)
- Android Studio (cho Android) hoặc Xcode (cho iOS)
- Backend server đang chạy

## 🔗 Kết nối Backend

App này cần backend đang chạy:

```bash
cd ../server
npm install
npm run seed    # Tạo dữ liệu mẫu
npm run dev     # Chạy server
```

Backend sẽ chạy tại `http://localhost:3000`

## 📦 API Endpoints được sử dụng

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh-token` - Làm mới token

### Books
- `GET /api/books` - Danh sách sách (có phân trang, filter)
- `GET /api/books/:id` - Chi tiết sách
- `GET /api/books/search?q=keyword` - Tìm kiếm
- `GET /api/books/categories` - Danh mục

### Orders (Yêu cầu auth)
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Danh sách đơn hàng
- `GET /api/orders/:id` - Chi tiết đơn hàng

### Users (Yêu cầu auth)
- `GET /api/users/profile` - Thông tin tài khoản
- `PUT /api/users/profile` - Cập nhật thông tin
- `POST /api/users/change-password` - Đổi mật khẩu

## 🎨 UI/UX

- Giao diện tiếng Việt 100%
- Material Design với màu chủ đạo: Blue (#2196F3)
- Responsive layout
- Loading states và error handling
- Pull-to-refresh
- Infinite scroll cho danh sách sách

## 🐛 Troubleshooting

### Không kết nối được API

1. Kiểm tra backend đang chạy
2. Kiểm tra IP trong `api.js` đúng chưa
3. Đảm bảo điện thoại và máy tính cùng mạng WiFi

### Lỗi khi build

```bash
# Clear cache
npx expo start --clear

# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### Ảnh không hiển thị

- Kiểm tra URL ảnh trong seed data backend
- Kiểm tra kết nối internet

## 📄 License

MIT License

## 👥 Tác giả

BookStore Mobile App - Ứng dụng bán sách đa nền tảng
