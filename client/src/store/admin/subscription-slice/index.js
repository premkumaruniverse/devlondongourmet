import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isLoading: false,
    subscriptionList: [],
    analytics: null,
};

export const fetchAllAdminSubscriptions = createAsyncThunk(
    '/admin/fetchAllSubscriptions',
    async () => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/subscription/list`,
            { withCredentials: true }
        );
        return response.data;
    }
);

export const updateSubscriptionByAdmin = createAsyncThunk(
    '/admin/updateSubscription',
    async ({ id, formData }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/subscription/update/${id}`,
            formData,
            { withCredentials: true }
        );
        return response.data;
    }
);

export const getAdminSubscriptionAnalytics = createAsyncThunk(
    '/admin/getAnalytics',
    async () => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/subscription/analytics`,
            { withCredentials: true }
        );
        return response.data;
    }
);

const adminSubscriptionSlice = createSlice({
    name: 'adminSubscription',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAdminSubscriptions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllAdminSubscriptions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.subscriptionList = action.payload.data;
            })
            .addCase(fetchAllAdminSubscriptions.rejected, (state) => {
                state.isLoading = false;
                state.subscriptionList = [];
            })
            .addCase(getAdminSubscriptionAnalytics.fulfilled, (state, action) => {
                state.analytics = action.payload.data;
            });
    },
});

export default adminSubscriptionSlice.reducer;
