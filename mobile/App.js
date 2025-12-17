import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { loginSuccess } from './src/redux/slices/authSlice';
import { loadCartFromStorage } from './src/redux/slices/cartSlice';

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Khôi phục trạng thái đăng nhập
      const token = await AsyncStorage.getItem('token');
      const userJson = await AsyncStorage.getItem('user');
      
      if (token && userJson) {
        const user = JSON.parse(userJson);
        dispatch(loginSuccess({ token, user }));
      }

      // Khôi phục giỏ hàng
      dispatch(loadCartFromStorage());
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  );
}
