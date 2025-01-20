import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for the backend
const BASE_URL = 'http://localhost:5000/api/products';

// Initial state
const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

// Async thunks for API calls

// Fetch all products
export const getProducts = createAsyncThunk('products/getProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Fetch product by ID
export const getProductById = createAsyncThunk('products/getProductById', async (productId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/${productId}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Create a new product
export const createProduct = createAsyncThunk('products/createProduct', async (productData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}`, productData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Delete a product by ID
export const deleteProductById = createAsyncThunk('products/deleteProductById', async (productId, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/${productId}`);
    return productId;  // Return the deleted product's ID
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Edit a product
export const editProduct = createAsyncThunk('products/editProduct', async ({ productId, productData }, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${productId}`, productData);
    return response.data;  // Return the updated product
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Add a review to a product
export const addReview = createAsyncThunk('products/addReview', async ({ productId, reviewData }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/${productId}/reviews`, reviewData);
    return response.data;  // Return the updated product with the new review
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Fetch all reviews for a product
export const getReviews = createAsyncThunk('products/getReviews', async (productId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/${productId}/reviews`);
    return response.data;  // Return the reviews
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Get the average rating for a product
export const getAverageRating = createAsyncThunk('products/getAverageRating', async (productId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/${productId}/average-rating`);
    return response.data;  // Return the average rating
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Products slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getProducts
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getProductById
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createProduct
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deleteProductById
      .addCase(deleteProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(product => product._id !== action.payload);
      })
      .addCase(deleteProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle editProduct
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(product => product._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;  // Update the product
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle addReview
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.product && state.product._id === action.payload._id) {
          state.product = action.payload;  // Update the product with the new review
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.reviews = action.payload
      })

      // Handle getReviews
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        if (state.product) {
          state.product.reviews = action.payload;  // Update the product's reviews
        }
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getAverageRating
      .addCase(getAverageRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAverageRating.fulfilled, (state, action) => {
        state.loading = false;
        if (state.product) {
          state.product.averageRating = action.payload.averageRating;  // Update the product's average rating
        }
      })
      .addCase(getAverageRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;