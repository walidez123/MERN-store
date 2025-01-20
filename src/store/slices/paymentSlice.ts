// redux/slices/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;

const BASE_URL = 'http://localhost:5000/api/payment'; // Adjust the URL as needed

const initialState = {
  clientSecret: null,
  loading: false,
  error: null,
};

export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async ({totalPrice}, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.post(
        BASE_URL,
        { totalPrice },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // This should contain the clientSecret
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.clientSecret = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret; // Store the client secret
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;

export default paymentSlice.reducer;