import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cấu hình base URL - thay đổi theo IP máy của bạn khi test trên thiết bị thật
//const API_BASE_URL = 'http://localhost:3000/api'; // Cho emulator Android Studio
// const API_BASE_URL = 'http://10.0.2.2:3000/api'; // Cho BlueStacks
// Hoặc dùng IP máy thực: 
const API_BASE_URL = 'http://192.168.1.10:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Thêm token vào header
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý lỗi
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn, xóa token và chuyển về màn hình login
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
