import { createSlice } from '@reduxjs/toolkit';
import * as orderService from '../../services/orderService';

const initialState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  setSelectedOrder,
} = orderSlice.actions;

// Thunks
export const fetchOrders = () => async (dispatch) => {
  try {
    dispatch(fetchOrdersStart());
    const response = await orderService.getUserOrders();
    
    if (response.success) {
      dispatch(fetchOrdersSuccess(response.data.orders));
    } else {
      const errorMsg = String(response.message || 'Lỗi khi tải đơn hàng').trim();
      dispatch(fetchOrdersFailure(errorMsg));
    }
  } catch (error) {
    let errorMsg = 'Lỗi khi tải đơn hàng';
    try {
      if (error.response?.data?.message) {
        errorMsg = String(error.response.data.message).trim() || 'Lỗi khi tải đơn hàng';
      } else if (error.message) {
        errorMsg = String(error.message).trim() || 'Lỗi khi tải đơn hàng';
      }
    } catch (e) {
      errorMsg = 'Lỗi khi tải đơn hàng';
    }
    dispatch(fetchOrdersFailure(errorMsg));
  }
};

export const createOrderThunk = (orderData) => async (dispatch) => {
  try {
    const response = await orderService.createOrder(orderData);
    return response;
  } catch (error) {
    throw error;
  }
};

export default orderSlice.reducer;
