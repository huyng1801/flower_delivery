# 🌸 Hướng dẫn chạy ứng dụng Flower Delivery

## Bước 1: Chạy Backend

```bash
# Mở terminal thứ nhất
cd server

# Cài đặt dependencies (chỉ lần đầu)
npm install

# Tạo dữ liệu mẫu (chỉ lần đầu)
node src/seed/seedData.js

# Chạy server
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## Bước 2: Cấu hình IP cho Mobile

### Nếu test trên thiết bị thật:

1. **Lấy IP máy tính:**
   - Windows: Mở CMD và chạy `ipconfig`
   - Mac/Linux: Chạy `ifconfig` hoặc `ip addr`
   - Tìm IPv4 Address (VD: 192.168.1.100)

2. **Cập nhật file mobile/src/services/api.js:**
   ```javascript
   const API_BASE_URL = 'http://192.168.1.100:3000/api';
   // Thay 192.168.1.100 bằng IP máy bạn
   ```

### Nếu test trên Emulator/Simulator:
Giữ nguyên: `http://localhost:3000/api`

## Bước 3: Chạy Mobile App

```bash
# Mở terminal thứ hai
cd mobile

# Cài đặt dependencies (chỉ lần đầu)
npm install

# Chạy ứng dụng
npm start
```

## Bước 4: Chọn thiết bị

Sau khi `npm start`, chọn:
- **a** - Mở Android Emulator
- **i** - Mở iOS Simulator
- **QR Code** - Quét bằng Expo Go app trên điện thoại thật

## 🔐 Đăng nhập

Sử dụng tài khoản demo:
```
Email: customer1@example.com
Mật khẩu: 123456
```

Hoặc đăng ký tài khoản mới!

## ⚠️ Lưu ý quan trọng

1. **Backend phải chạy trước** khi chạy mobile app
2. **Điện thoại và máy tính phải cùng mạng WiFi** khi test trên thiết bị thật
3. **Đảm bảo firewall không chặn** port 3000

## 🐛 Gặp lỗi?

### Backend không chạy:
```bash
# Kiểm tra MongoDB đang chạy chưa
# Kiểm tra port 3000 có bị chiếm không
```

### Mobile không kết nối được:
1. Kiểm tra IP trong `api.js` đúng chưa
2. Ping thử IP: `ping 192.168.1.100`
3. Thử tắt firewall tạm thời

### Clear cache:
```bash
cd mobile
npx expo start --clear
```
