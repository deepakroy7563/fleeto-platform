import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBikes = createAsyncThunk('bikes/fetchBikes', async (params, { rejectWithValue }) => {
  try {
    const response = await api.get('/bikes', { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message || 'Failed to fetch bikes');
  }
});

export const fetchBikeById = createAsyncThunk('bikes/fetchBikeById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/bikes/${id}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message || 'Failed to fetch bike details');
  }
});

const initialState = {
  bikes: [],
  currentBike: null,
  loading: false,
  error: null,
  total: 0,
  pagination: {},
};

const bikeSlice = createSlice({
  name: 'bikes',
  initialState,
  reducers: {
    clearBikeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBikes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBikes.fulfilled, (state, action) => {
        state.loading = false;
        state.bikes = action.payload.data;
        state.total = action.payload.total;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBikeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBikeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBike = action.payload;
      })
      .addCase(fetchBikeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBikeError } = bikeSlice.actions;
export default bikeSlice.reducer;
