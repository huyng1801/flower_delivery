import { createSlice } from '@reduxjs/toolkit';
import * as flowerService from '../../services/flowerService';

const initialState = {
  flowers: [],
  selectedFlower: null,
  categories: [],
  bestSelling: [],
  newFlowers: [],
  occasionFlowers: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
};

const flowerSlice = createSlice({
  name: 'flowers',
  initialState,
  reducers: {
    fetchFlowersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFlowersSuccess: (state, action) => {
      state.loading = false;
      state.flowers = action.payload.flowers;
      state.pagination = action.payload.pagination;
    },
    fetchFlowersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedFlower: (state, action) => {
      state.selectedFlower = action.payload;
    },
    setCategoriesSuccess: (state, action) => {
      state.categories = action.payload;
    },
    setBestSellingFlowers: (state, action) => {
      state.bestSelling = action.payload;
    },
    setNewFlowers: (state, action) => {
      state.newFlowers = action.payload;
    },
    setOccasionFlowers: (state, action) => {
      state.occasionFlowers = action.payload.flowers;
      state.pagination = action.payload.pagination;
    },
  },
});

export const {
  fetchFlowersStart,
  fetchFlowersSuccess,
  fetchFlowersFailure,
  setSelectedFlower,
  setCategoriesSuccess,
  setBestSellingFlowers,
  setNewFlowers,
  setOccasionFlowers,
} = flowerSlice.actions;

// Thunks
export const fetchFlowers = (params = {}) => async (dispatch) => {
  try {
    dispatch(fetchFlowersStart());
    const response = await flowerService.getFlowers(params);
    
    if (response.success) {
      dispatch(fetchFlowersSuccess(response.data));
    } else {
      dispatch(fetchFlowersFailure(response.message));
    }
  } catch (error) {
    dispatch(fetchFlowersFailure(error.response?.data?.message || 'Lỗi khi tải hoa'));
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    const response = await flowerService.getCategories();
    
    if (response.success) {
      dispatch(setCategoriesSuccess(response.data));
    }
  } catch (error) {
    console.error('Lỗi khi tải danh mục:', error);
  }
};

export const searchFlowersThunk = (query, page = 1) => async (dispatch) => {
  try {
    dispatch(fetchFlowersStart());
    const response = await flowerService.searchFlowers(query, page);
    
    if (response.success) {
      dispatch(fetchFlowersSuccess(response.data));
    } else {
      dispatch(fetchFlowersFailure(response.message));
    }
  } catch (error) {
    dispatch(fetchFlowersFailure(error.response?.data?.message || 'Lỗi tìm kiếm'));
  }
};

export const fetchBestSellingFlowers = (limit = 10) => async (dispatch) => {
  try {
    const response = await flowerService.getBestSellingFlowers(limit);
    
    if (response.success) {
      dispatch(setBestSellingFlowers(response.data));
    }
  } catch (error) {
    console.error('Lỗi khi tải hoa bán chạy:', error);
  }
};

export const fetchNewFlowers = (limit = 10) => async (dispatch) => {
  try {
    const response = await flowerService.getNewFlowers(limit);
    
    if (response.success) {
      dispatch(setNewFlowers(response.data));
    }
  } catch (error) {
    console.error('Lỗi khi tải hoa mới:', error);
  }
};

export const fetchFlowersByOccasion = (occasion, page = 1) => async (dispatch) => {
  try {
    dispatch(fetchFlowersStart());
    const response = await flowerService.getFlowersByOccasion(occasion, page);
    
    if (response.success) {
      dispatch(setOccasionFlowers(response.data));
    } else {
      dispatch(fetchFlowersFailure(response.message));
    }
  } catch (error) {
    dispatch(fetchFlowersFailure(error.response?.data?.message || 'Lỗi khi tải hoa theo dịp'));
  }
};

export default flowerSlice.reducer;