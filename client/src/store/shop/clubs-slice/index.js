import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  clubList: [],
  clubDetails: null,
  clubReviews: [],
};

export const fetchAllLiveClubs = createAsyncThunk(
  "/clubs/fetchAllLiveClubs",
  async ({ category, sort }) => {
    const query = new URLSearchParams({
      ...(category && { category }),
      ...(sort && { sort }),
    });

    const result = await axios.get(
      `http://https://devlondongourmet.vercel.app/api/shop/clubs/get?${query}`
    );

    return result?.data;
  }
);

export const fetchClubDetails = createAsyncThunk(
  "/clubs/fetchClubDetails",
  async (id) => {
    const result = await axios.get(
      `http://https://devlondongourmet.vercel.app/api/shop/clubs/details/${id}`
    );

    return result?.data;
  }
);

export const addClubReview = createAsyncThunk(
  "/clubs/addClubReview",
  async ({ clubId, reviewData }) => {
    const result = await axios.post(
      `http://https://devlondongourmet.vercel.app/api/shop/clubs/review/${clubId}`,
      reviewData
    );

    return result?.data;
  }
);

export const getClubReviews = createAsyncThunk(
  "/clubs/getClubReviews",
  async (clubId) => {
    const result = await axios.get(
      `http://https://devlondongourmet.vercel.app/api/shop/clubs/reviews/${clubId}`
    );

    return result?.data;
  }
);

const shoppingClubSlice = createSlice({
  name: "shoppingClubs",
  initialState,
  reducers: {
    setClubDetails: (state) => {
      state.clubDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLiveClubs.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllLiveClubs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clubList = action.payload.data;
      })
      .addCase(fetchAllLiveClubs.rejected, (state, action) => {
        state.isLoading = false;
        state.clubList = [];
      })
      .addCase(fetchClubDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchClubDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clubDetails = action.payload.data;
      })
      .addCase(fetchClubDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.clubDetails = null;
      })
      .addCase(addClubReview.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(addClubReview.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally update reviews in state
      })
      .addCase(addClubReview.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getClubReviews.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getClubReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clubReviews = action.payload.data;
      })
      .addCase(getClubReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.clubReviews = [];
      });
  },
});

export const { setClubDetails } = shoppingClubSlice.actions;

export default shoppingClubSlice.reducer;
