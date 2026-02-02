import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../config/api";

const initialState = {
  isLoading: false,
  recipeList: [],
  recipeDetails: null,
  error: null,
};

export const fetchAllRecipes = createAsyncThunk(
  "/recipes/fetchAllRecipes",
  async (queryParams = {}) => {
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await axios.get(
      `${API_URL}/api/shop/recipes${queryString ? `?${queryString}` : ''}`
    );

    return response.data;
  }
);

export const fetchRecipeDetails = createAsyncThunk(
  "/recipes/fetchRecipeDetails",
  async (id) => {
    const response = await axios.get(
      `${API_URL}/api/shop/recipes/${id}`
    );

    return response.data;
  }
);

const shoppingRecipesSlice = createSlice({
  name: "shoppingRecipesSlice",
  initialState,
  reducers: {
    resetRecipeDetails: (state) => {
      state.recipeDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipeList = action.payload.data;
      })
      .addCase(fetchAllRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.recipeList = [];
      })
      .addCase(fetchRecipeDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipeDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipeDetails = action.payload.data;
      })
      .addCase(fetchRecipeDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.recipeDetails = null;
      });
  },
});

export const { resetRecipeDetails } = shoppingRecipesSlice.actions;

export default shoppingRecipesSlice.reducer;
