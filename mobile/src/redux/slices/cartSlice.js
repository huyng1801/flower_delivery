import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  items: [], // { flower, quantity }
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { flower, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.flower._id === flower._id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ flower, quantity });
      }
      
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.flower.price * item.quantity,
        0
      );
    },
    removeFromCart: (state, action) => {
      const flowerId = action.payload;
      state.items = state.items.filter(item => item.flower._id !== flowerId);
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.flower.price * item.quantity,
        0
      );
    },
    updateQuantity: (state, action) => {
      const { flowerId, quantity } = action.payload;
      const item = state.items.find(item => item.flower._id === flowerId);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
        state.totalPrice = state.items.reduce(
          (total, item) => total + item.flower.price * item.quantity,
          0
        );
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
    loadCart: (state, action) => {
      state.items = action.payload.items || [];
      state.totalPrice = action.payload.totalPrice || 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCart,
} = cartSlice.actions;

// Thunks
export const saveCartToStorage = () => async (dispatch, getState) => {
  const { cart } = getState();
  await AsyncStorage.setItem('cart', JSON.stringify(cart));
};

export const loadCartFromStorage = () => async (dispatch) => {
  try {
    const cartData = await AsyncStorage.getItem('cart');
    if (cartData) {
      dispatch(loadCart(JSON.parse(cartData)));
    }
  } catch (error) {
    console.error('Lỗi khi load giỏ hàng:', error);
  }
};

export default cartSlice.reducer;
