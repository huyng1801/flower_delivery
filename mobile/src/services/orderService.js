import apiClient from './api';

/**
 * Tạo đơn hàng
 */
export const createOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

/**
 * Lấy danh sách đơn hàng
 */
export const getUserOrders = async (page = 1) => {
  const response = await apiClient.get('/orders', { params: { page } });
  return response.data;
};

/**
 * Lấy chi tiết đơn hàng
 */
export const getOrderById = async (id) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};
