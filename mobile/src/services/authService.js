import apiClient from './api';

/**
 * Đăng ký tài khoản
 */
export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

/**
 * Đăng nhập
 */
export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

/**
 * Làm mới token
 */
export const refreshToken = async (token) => {
  const response = await apiClient.post('/auth/refresh-token', { token });
  return response.data;
};
