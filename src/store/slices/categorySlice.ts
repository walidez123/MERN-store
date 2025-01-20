import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for the backend
const BASE_URL = 'http://localhost:5000/api/categories';

// Initial state
const initialState = {
  categories: [],
  category: null,
  loading: false,
  error: null,
};

// Async thunks for API calls

// Fetch all categories
export const getCategories = createAsyncThunk('categories/getCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;  // Assume the server returns a list of categories
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Fetch category by ID
export const getCategoryById = createAsyncThunk('categories/getCategoryById', async (categoryId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/${categoryId}`);
    return response.data;  // Return the single category
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Create a new category
export const createCategory = createAsyncThunk('categories/createCategory', async (categoryData, { rejectWithValue }) => {
  try {
    const response = await axios.post(BASE_URL, categoryData);
    return response.data;  // Return the newly created category
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Delete a category by ID
export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (categoryId, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/${categoryId}`);
    return categoryId;  // Return the ID of the deleted category to remove it from the list
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Categories slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getCategories
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;  // Update state with fetched categories
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle getCategoryById
      .addCase(getCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;  // Set the single category data
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle createCategory
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);  // Add the new category to the list
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle deleteCategory
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(category => category._id !== action.payload);  // Remove deleted category
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;