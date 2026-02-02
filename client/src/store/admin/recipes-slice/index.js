import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../config/api";

const initialState = {
  isLoading: false,
  recipeList: [],
  error: null,
};

export const addNewRecipe = createAsyncThunk(
  "/admin/recipes/addNewRecipe",
  async (formData) => {
    const response = await axios.post(
      `${API_URL}/api/admin/recipes`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }
);

export const fetchAllRecipes = createAsyncThunk(
  "/admin/recipes/fetchAllRecipes",
  async () => {
    const response = await axios.get(
      `${API_URL}/api/admin/recipes`
    );

    return response.data;
  }
);

export const editRecipe = createAsyncThunk(
  "/admin/recipes/editRecipe",
  async ({ id, formData }) => {
    const response = await axios.put(
      `${API_URL}/api/admin/recipes/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }
);

export const deleteRecipe = createAsyncThunk(
  "/admin/recipes/deleteRecipe",
  async (id) => {
    const response = await axios.delete(
      `${API_URL}/api/admin/recipes/${id}`
    );

    return response.data;
  }
);

const AdminRecipesSlice = createSlice({
  name: "adminRecipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewRecipe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewRecipe.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchAllRecipes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipeList = action.payload.data;
      })
      .addCase(fetchAllRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.recipeList = [];
      })
      .addCase(editRecipe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(editRecipe.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteRecipe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default AdminRecipesSlice.reducer;
