import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { getFlowerById } from '../services/flowerService';
import { addToCart } from '../redux/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';

const FlowerDetailScreen = ({ route, navigation }) => {
  const { flowerId } = route.params;
  const [flower, setFlower] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    loadFlowerDetail();
  }, [flowerId]);

  const loadFlowerDetail = async () => {
    try {
      setLoading(true);
      const response = await getFlowerById(flowerId);
      if (response.success) {
        setFlower(response.data);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin hoa');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!flower) return;
    
    if (flower.quantity === 0) {
      Alert.alert('Thông báo', 'Hoa này hiện đã hết hàng');
      return;
    }

    dispatch(addToCart(flower));
    Alert.alert(
      'Thành công',
      'Đã thêm hoa vào giỏ hàng',
      [
        { text: 'Tiếp tục mua', style: 'cancel' },
        { text: 'Xem giỏ hàng', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!flower) {
    return (
      <View style={styles.centerContainer}>
        <Text>Không tìm thấy hoa</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image
          source={{ uri: flower.image }}
          style={styles.flowerImage}
          resizeMode="cover"
        />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{flower.name}</Text>
          <Text style={styles.category}>Danh mục: {flower.category}</Text>
          
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < Math.floor(flower.rating) ? "star" : "star-outline"}
                size={20}
                color="#FFA000"
              />
            ))}
            <Text style={styles.ratingText}>({flower.rating})</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(flower.price)}</Text>
            <View style={styles.stockContainer}>
              {flower.quantity > 0 ? (
                <Text style={styles.stockText}>Còn {flower.quantity} sản phẩm</Text>
              ) : (
                <Text style={styles.outOfStock}>Hết hàng</Text>
              )}
            </View>
          </View>

          {/* Thông tin đặc biệt của hoa */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Thông tin sản phẩm</Text>
            
            {flower.freshnessDays && (
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.infoText}>Độ tươi: {flower.freshnessDays} ngày</Text>
              </View>
            )}
            
            {flower.colors && flower.colors.length > 0 && (
              <View style={styles.infoRow}>
                <Ionicons name="color-palette-outline" size={16} color="#666" />
                <Text style={styles.infoText}>Màu sắc: {flower.colors.join(', ')}</Text>
              </View>
            )}
            
            {flower.occasions && flower.occasions.length > 0 && (
              <View style={styles.infoRow}>
                <Ionicons name="heart-outline" size={16} color="#666" />
                <Text style={styles.infoText}>Dịp phù hợp: {flower.occasions.join(', ')}</Text>
              </View>
            )}
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{flower.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={flower.quantity === 0}
          >
            <Ionicons name="remove" size={20} color="#666" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.min(flower.quantity, quantity + 1))}
            disabled={flower.quantity === 0}
          >
            <Ionicons name="add" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            flower.quantity === 0 && styles.addToCartButtonDisabled
          ]}
          onPress={handleAddToCart}
          disabled={flower.quantity === 0}
        >
          <Text style={styles.addToCartText}>
            {flower.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  flowerImage: {
    width: '100%',
    height: 320,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
    color: '#2D3436',
    letterSpacing: 0.5,
  },
  category: {
    fontSize: 16,
    color: '#74788D',
    marginBottom: 12,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 8,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FF6B6B',
    letterSpacing: 0.5,
  },
  stockContainer: {
    alignItems: 'flex-end',
  },
  stockText: {
    color: '#51CF66',
    fontSize: 15,
    fontWeight: '600',
  },
  outOfStock: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#2D3436',
    letterSpacing: 0.3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F3F4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#51CF66',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#51CF66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default FlowerDetailScreen;