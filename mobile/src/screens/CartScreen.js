import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';
import { createOrderThunk } from '../redux/slices/orderSlice';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');

  // Auto-fill thông tin user khi component mount
  useEffect(() => {
    if (user) {
      if (user.address && user.address.trim()) {
        setShippingAddress(user.address);
      }
      if (user.phone && user.phone.trim()) {
        setPhone(user.phone);
      }
    }
  }, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleRemoveItem = (flowerId) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa hoa này khỏi giỏ hàng?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', onPress: () => dispatch(removeFromCart(flowerId)) },
      ]
    );
  };

  const handleUpdateQuantity = (flowerId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ flowerId, quantity: newQuantity }));
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng trống');
      return;
    }

    if (!shippingAddress || !phone) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ địa chỉ và số điện thoại');
      return;
    }

    try {
      const orderData = {
        items: items.map(item => ({
          flowerId: item.flower._id,
          quantity: item.quantity,
        })),
        shippingAddress,
        phone,
      };

      const response = await dispatch(createOrderThunk(orderData));
      
      if (response.success) {
        dispatch(clearCart());
        Alert.alert(
          'Đặt hàng thành công!',
          'Đơn hàng của bạn đã được tạo',
          [
            { text: 'Xem đơn hàng', onPress: () => navigation.navigate('Orders') },
            { text: 'Tiếp tục mua', onPress: () => navigation.navigate('Home') },
          ]
        );
      } else {
        let errorMsg = 'Không thể tạo đơn hàng';
        try {
          errorMsg = String(response.message || errorMsg).trim();
        } catch (e) {
          errorMsg = 'Không thể tạo đơn hàng';
        }
        Alert.alert('Lỗi', errorMsg);
      }
    } catch (error) {
      let errorMsg = 'Không thể tạo đơn hàng';
      try {
        if (error.response?.data?.message) {
          errorMsg = String(error.response.data.message).trim() || errorMsg;
        } else if (error.message) {
          errorMsg = String(error.message).trim() || errorMsg;
        }
      } catch (e) {
        errorMsg = 'Không thể tạo đơn hàng';
      }
      Alert.alert('Lỗi', errorMsg);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.flower.image }} style={styles.itemImage} />
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.flower.name}</Text>
        <Text style={styles.itemCategory}>{item.flower.category}</Text>
        {item.flower.freshnessDays && (
          <Text style={styles.itemFreshness}>Tươi {item.flower.freshnessDays} ngày</Text>
        )}
        <Text style={styles.itemPrice}>{formatPrice(item.flower.price)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.flower._id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={20} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.flower._id, item.quantity + 1)}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.flower._id)}
      >
        <Ionicons name="trash-outline" size={24} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={100} color="#ccc" />
        <Text style={styles.emptyText}>Giỏ hàng trống</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopButtonText}>Mua sắm ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ Hàng</Text>
        <TouchableOpacity onPress={() => dispatch(clearCart())}>
          <Text style={styles.clearText}>Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.flower._id}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.checkoutContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Địa chỉ giao hàng *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập địa chỉ"
            value={shippingAddress}
            onChangeText={setShippingAddress}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số điện thoại *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 25,
    backgroundColor: '#6A4C93',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#6A4C93',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  clearText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    overflow: 'hidden',
  },
  listContent: {
    padding: 10,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginHorizontal: 5,
  },
  itemImage: {
    width: 85,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },  itemCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemFreshness: {
    fontSize: 11,
    color: '#4CAF50',
    marginBottom: 2,
    fontWeight: 'bold',
  },  itemAuthor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#6A4C93',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#6A4C93',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quantity: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    justifyContent: 'center',
    padding: 5,
  },
  checkoutContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FF6B6B',
    letterSpacing: 0.5,
  },
  checkoutButton: {
    backgroundColor: '#51CF66',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#51CF66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 20,
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
