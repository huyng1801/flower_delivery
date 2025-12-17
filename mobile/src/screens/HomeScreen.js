import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlowers, fetchCategories, searchFlowersThunk } from '../redux/slices/flowerSlice';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { flowers, categories, loading, pagination } = useSelector(state => state.flowers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchFlowers());
    dispatch(fetchCategories());
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(searchFlowersThunk(searchQuery));
    } else {
      dispatch(fetchFlowers({ category: selectedCategory }));
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setSearchQuery('');
    dispatch(fetchFlowers({ category: category === selectedCategory ? '' : category }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchFlowers({ category: selectedCategory }));
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages && !loading) {
      dispatch(fetchFlowers({ 
        page: pagination.page + 1,
        category: selectedCategory 
      }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderFlower = ({ item }) => (
    <TouchableOpacity
      style={styles.flowerCard}
      onPress={() => navigation.navigate('FlowerDetail', { flowerId: item._id })}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.flowerImage}
          resizeMode="cover"
        />
        {item.quantity === 0 && (
          <View style={styles.soldOutBadge}>
            <Text style={styles.soldOutText}>Hết hàng</Text>
          </View>
        )}
        {item.rating && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#FFA000" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        )}
        {item.freshnessDays && (
          <View style={styles.freshnessBadge}>
            <Text style={styles.freshnessText}>{item.freshnessDays} ngày</Text>
          </View>
        )}
      </View>
      <View style={styles.flowerInfo}>
        <Text style={styles.flowerName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.flowerCategory} numberOfLines={1}>{item.category}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.flowerPrice}>{formatPrice(item.price)}</Text>
        </View>
        <Text style={styles.stockText}>
          {item.quantity > 0 ? `Còn ${item.quantity}` : 'Hết hàng'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6F00" />
      {/* Header Search Bar */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm hoa, danh mục..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              dispatch(fetchFlowers({ category: selectedCategory }));
            }}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipActive
              ]}
              onPress={() => handleCategorySelect(item)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Flowers List */}
      {loading && flowers.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Đang tải hoa...</Text>
        </View>
      ) : flowers.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="flower-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Không tìm thấy hoa</Text>
        </View>
      ) : (
        <FlatList
          data={flowers}
          renderItem={renderFlower}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && flowers.length > 0 ? (
              <ActivityIndicator size="small" color="#2196F3" style={styles.loadingMore} />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  header: {
    backgroundColor: '#4ECDC4',
    paddingTop: 15,
    paddingBottom: 18,
    paddingHorizontal: 15,
    elevation: 8,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    padding: 0,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 25,
    backgroundColor: '#F1F3F4',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryChipActive: {
    backgroundColor: '#4ECDC4',
    elevation: 4,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  categoryText: {
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  flowerCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 6,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    maxWidth: '48%',
    overflow: 'hidden',
  },
  flowerImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  flowerInfo: {
    padding: 12,
  },
  flowerName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    height: 36,
    color: '#2D3436',
  },
  flowerCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  flowerPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FF6B6B',
    letterSpacing: 0.5,
  },
  freshnessBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  freshnessText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  soldOutBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#f44336',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  soldOutText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
  },
  stockText: {
    color: '#fff',
    fontSize: 10,
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
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  },
  loadingMore: {
    paddingVertical: 20,
  },
});

export default HomeScreen;
