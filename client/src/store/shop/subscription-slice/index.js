import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isLoading: false,
    subscriptionList: [],
    currentSubscription: null,
};

export const fetchAllSubscriptions = createAsyncThunk(
    '/shop/fetchAllSubscriptions',
    async () => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shop/subscription/list`,
            { withCredentials: true }
        );
        return response.data;
    }
);

export const createNewSubscription = createAsyncThunk(
    '/shop/createNewSubscription',
    async (formData) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shop/subscription/create`,
            formData,
            { withCredentials: true }
        );
        return response.data;
    }
);

export const updateSubscriptionStatus = createAsyncThunk(
    '/shop/updateSubscriptionStatus',
    async ({ id, status, cancellationReason }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shop/subscription/update-status/${id}`,
            { status, cancellationReason },
            { withCredentials: true }
        );
        return response.data;
    }
);

const shopSubscriptionSlice = createSlice({
    name: 'shopSubscription',
    initialState,
    reducers: {
        resetSubscriptionDetails: (state) => {
            state.currentSubscription = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSubscriptions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllSubscriptions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.subscriptionList = action.payload.data;
            })
            .addCase(fetchAllSubscriptions.rejected, (state) => {
                state.isLoading = false;
                state.subscriptionList = [];
            });
    },
});

export const { resetSubscriptionDetails } = shopSubscriptionSlice.actions;
export default shopSubscriptionSlice.reducer;
