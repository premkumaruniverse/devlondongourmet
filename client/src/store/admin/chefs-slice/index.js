import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  chefList: [],
};

export const addNewChef = createAsyncThunk(
  "/chefs/addnewchef",
  async (formData) => {
    const result = await axios.post(
      "http://https://devlondongourmet.vercel.app/api/admin/chefs/add",
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

export const fetchAllChefs = createAsyncThunk(
  "/chefs/fetchAllChefs",
  async () => {
    const result = await axios.get(
      "http://https://devlondongourmet.vercel.app/api/admin/chefs/get"
    );

    return result?.data;
  }
);

export const fetchChefById = createAsyncThunk(
  "/chefs/fetchChefById",
  async (id) => {
    const result = await axios.get(
      `http://https://devlondongourmet.vercel.app/api/admin/chefs/get/${id}`
    );

    return result?.data;
  }
);

export const editChef = createAsyncThunk(
  "/chefs/editChef",
  async ({ id, formData }) => {
    const result = await axios.put(
      `http://https://devlondongourmet.vercel.app/api/admin/chefs/edit/${id}`,
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

export const deleteChef = createAsyncThunk(
  "/chefs/deleteChef",
  async (id) => {
    const result = await axios.delete(
      `http://https://devlondongourmet.vercel.app/api/admin/chefs/delete/${id}`
    );

    return result?.data;
  }
);

const AdminChefsSlice = createSlice({
  name: "adminChefs",
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
      });
  },
});

export default AdminChefsSlice.reducer;
