import apiClient from './api';

/**
 * Lấy thông tin profile
 */
export const getProfile = async () => {
  const response = await apiClient.get('/users/profile');
  return response.data;
};

/**
 * Cập nhật profile
 */
export const updateProfile = async (userData) => {
  const response = await apiClient.put('/users/profile', userData);
  return response.data;
};

/**
 * Đổi mật khẩu
 */
export const changePassword = async (passwordData) => {
  const response = await apiClient.post('/users/change-password', passwordData);
  return response.data;
};
