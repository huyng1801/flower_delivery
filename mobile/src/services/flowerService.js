import apiClient from './api';

/**
 * Lấy danh sách hoa
 */
export const getFlowers = async (params = {}) => {
  const response = await apiClient.get('/flowers', { params });
  return response.data;
};

/**
 * Lấy chi tiết hoa
 */
export const getFlowerById = async (id) => {
  const response = await apiClient.get(`/flowers/${id}`);
  return response.data;
};

/**
 * Tìm kiếm hoa
 */
export const searchFlowers = async (query, page = 1) => {
  const response = await apiClient.get('/flowers/search', {
    params: { q: query, page }
  });
  return response.data;
};

/**
 * Lấy danh mục hoa
 */
export const getCategories = async () => {
  const response = await apiClient.get('/flowers/categories');
  return response.data;
};

/**
 * Lấy hoa bán chạy nhất
 */
export const getBestSellingFlowers = async (limit = 10) => {
  const response = await apiClient.get('/flowers/best-selling', {
    params: { limit }
  });
  return response.data;
};

/**
 * Lấy hoa mới nhất
 */
export const getNewFlowers = async (limit = 10) => {
  const response = await apiClient.get('/flowers/new', {
    params: { limit }
  });
  return response.data;
};

/**
 * Lấy hoa theo dịp
 */
export const getFlowersByOccasion = async (occasion, page = 1) => {
  const response = await apiClient.get(`/flowers/occasion/${occasion}`, {
    params: { page }
  });
  return response.data;
};