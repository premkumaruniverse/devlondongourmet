import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../config/api";

const initialState = {
  isLoading: false,
  quotes: [],
};

export const fetchAllQuotes = createAsyncThunk(
  "/quotes/fetchAllQuotes",
  async () => {
    const result = await axios.get(`${API_URL}/api/admin/quotes/get`);
    return result?.data;
  }
);

export const deleteQuote = createAsyncThunk(
  "/quotes/deleteQuote",
  async (id) => {
    const result = await axios.delete(`${API_URL}/api/admin/quotes/delete/${id}`);
    return { id, ...result?.data };
  }
);

const AdminQuotesSlice = createSlice({
  name: "adminQuotes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllQuotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllQuotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quotes = action.payload?.data || [];
      })
      .addCase(fetchAllQuotes.rejected, (state) => {
        state.isLoading = false;
        state.quotes = [];
      })
      .addCase(deleteQuote.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.quotes = state.quotes.filter((q) => q._id !== action.payload.id);
        }
      });
  },
});

export default AdminQuotesSlice.reducer;
