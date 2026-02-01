import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../config/api";

const initialState = {
  isLoading: false,
  serviceList: [],
  serviceDetails: null,
};

export const fetchShopServices = createAsyncThunk(
  "/shop/services/fetchShopServices",
  async () => {
    const result = await axios.get(
      `${API_URL}/api/shop/services/get`
    );

    return result?.data;
  }
);

export const fetchServiceDetails = createAsyncThunk(
  "/shop/services/fetchServiceDetails",
  async (id) => {
    const result = await axios.get(
      `${API_URL}/api/shop/services/get/${id}`
    );

    return result?.data;
  }
);

const ShopServicesSlice = createSlice({
  name: "shopServices",
  initialState,
  reducers: {
    setServiceDetails: (state) => {
      state.serviceDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopServices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShopServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serviceList = action.payload.data;
      })
      .addCase(fetchShopServices.rejected, (state, action) => {
        state.isLoading = false;
        state.serviceList = [];
      })
      .addCase(fetchServiceDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchServiceDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serviceDetails = action.payload.data;
      })
      .addCase(fetchServiceDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.serviceDetails = null;
      });
  },
});

export const { setServiceDetails } = ShopServicesSlice.actions;

export default ShopServicesSlice.reducer;
