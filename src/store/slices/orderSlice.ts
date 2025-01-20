import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/orders';

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
};

export const getOrders = createAsyncThunk('orders/getOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});
export const getCurrentUserOrders = createAsyncThunk(
  'orders/getCurrentUserOrders', // Use a unique action type
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/currentUser`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const getOrderById = createAsyncThunk('orders/getOrderById', async (orderId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/${orderId}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const createOrder = createAsyncThunk('orders/createOrder', async ({ shippingAddress, phoneNumber, cash }, { rejectWithValue }) => {
  try {
    const response = await axios.post(BASE_URL, { shippingAddress, phoneNumber, cash });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (orderId, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/${orderId}`);
    return orderId;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/${orderId}/status`, { status });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getCurrentUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
        if (state.order && state.order._id === action.payload._id) {
          state.order = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default orderSlice.reducer;