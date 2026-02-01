import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../config/api";

const initialState = {
  isLoading: false,
  serviceList: [],
};

export const addNewService = createAsyncThunk(
  "/services/addNewService",
  async (formData) => {
    const result = await axios.post(
      `${API_URL}/api/admin/services/add`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const fetchAllServices = createAsyncThunk(
  "/services/fetchAllServices",
  async () => {
    const result = await axios.get(
      `${API_URL}/api/admin/services/get`
    );

    return result?.data;
  }
);

export const editService = createAsyncThunk(
  "/services/editService",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${API_URL}/api/admin/services/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const deleteService = createAsyncThunk(
  "/services/deleteService",
  async (id) => {
    const result = await axios.delete(
      `${API_URL}/api/admin/services/delete/${id}`
    );

    return result?.data;
  }
);

const AdminServicesSlice = createSlice({
  name: "adminServices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllServices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serviceList = action.payload.data;
      })
      .addCase(fetchAllServices.rejected, (state, action) => {
        state.isLoading = false;
        state.serviceList = [];
      });
  },
});

export default AdminServicesSlice.reducer;
