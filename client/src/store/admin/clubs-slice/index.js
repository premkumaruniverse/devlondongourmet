import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../config/api";

const initialState = {
  isLoading: false,
  clubList: [],
  chefsList: [],
};

export const addNewClub = createAsyncThunk(
  "/clubs/addnewclub",
  async (formData) => {
    const result = await axios.post(
      `${API_URL}/api/admin/clubs/add`,
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

export const fetchAllClubs = createAsyncThunk(
  "/clubs/fetchAllClubs",
  async () => {
    const result = await axios.get(
      `${API_URL}/api/admin/clubs/get`
    );

    return result?.data;
  }
);

export const fetchAllChefs = createAsyncThunk(
  "/clubs/fetchAllChefs",
  async () => {
    const result = await axios.get(
      `${API_URL}/api/admin/clubs/chefs`
    );

    return result?.data;
  }
);

export const editClub = createAsyncThunk(
  "/clubs/editClub",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${API_URL}/api/admin/clubs/edit/${id}`,
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

export const deleteClub = createAsyncThunk(
  "/clubs/deleteClub",
  async (id) => {
    const result = await axios.delete(
      `${API_URL}/api/admin/clubs/delete/${id}`
    );

    return result?.data;
  }
);

export const addEventSchedule = createAsyncThunk(
  "/clubs/addEventSchedule",
  async (formData) => {
    const result = await axios.post(
      `${API_URL}/api/admin/clubs/add-schedule`,
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

export const fetchEventSchedules = createAsyncThunk(
  "/clubs/fetchEventSchedules",
  async (clubId) => {
    const result = await axios.get(
      `${API_URL}/api/admin/clubs/schedules/${clubId}`
    );

    return result?.data;
  }
);

const AdminClubsSlice = createSlice({
  name: "adminClubs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllClubs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllClubs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clubList = action.payload.data;
      })
      .addCase(fetchAllClubs.rejected, (state, action) => {
        state.isLoading = false;
        state.clubList = [];
      })
      .addCase(fetchAllChefs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllChefs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chefsList = action.payload.data;
      })
      .addCase(fetchAllChefs.rejected, (state, action) => {
        state.isLoading = false;
        state.chefsList = [];
      });
  },
});

export default AdminClubsSlice.reducer;
