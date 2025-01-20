import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/messages"; // Adjust the URL as needed

// Initial state
const initialState = {
  messages: [], // List of all messages
  message: null, // Single message
  loading: false, // Loading state
  error: null, // Error state
};

// Async thunks for API calls

// Fetch all messages
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Fetch a single message by ID
export const fetchMessageById = createAsyncThunk(
  "messages/fetchMessageById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Create a new message
export const createMessage = createAsyncThunk(
  "messages/createMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, messageData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Update a message by ID
export const updateMessage = createAsyncThunk(
  "messages/updateMessage",
  async ({ id, messageData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, messageData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Delete a message by ID
export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Messages slice
const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchMessages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetchMessageById
      .addCase(fetchMessageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessageById.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(fetchMessageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createMessage
      .addCase(createMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload); // Add the new message to the list
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateMessage
      .addCase(updateMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = state.messages.map((message) =>
          message._id === action.payload._id ? action.payload : message
        ); // Update the message in the list
      })
      .addCase(updateMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deleteMessage
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = state.messages.filter(
          (message) => message._id !== action.payload
        ); // Remove the deleted message from the list
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default messageSlice.reducer;