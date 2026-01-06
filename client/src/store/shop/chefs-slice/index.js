import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  chefList: [],
  chefDetails: null,
};

export const fetchAllChefs = createAsyncThunk(
  "/chefs/fetchAllChefs",
  async () => {
    const result = await axios.get(
      "http://localhost:5000/api/shop/chefs/get"
    );

    return result?.data;
  }
);

export const fetchChefDetails = createAsyncThunk(
  "/chefs/fetchChefDetails",
  async (id) => {
    const result = await axios.get(
      `http://localhost:5000/api/shop/chefs/get/${id}`
    );

    return result?.data;
  }
);

const ShoppingChefsSlice = createSlice({
  name: "shoppingChefs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllChefs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllChefs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chefList = action.payload.data;
      })
      .addCase(fetchAllChefs.rejected, (state, action) => {
        state.isLoading = false;
        state.chefList = [];
      })
      .addCase(fetchChefDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChefDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chefDetails = action.payload.data;
      })
      .addCase(fetchChefDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.chefDetails = null;
      });
  },
});

export default ShoppingChefsSlice.reducer;
