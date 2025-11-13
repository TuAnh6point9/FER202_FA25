// paymentSlice.js - Redux Toolkit slice cho Payment CRUD
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// 1. Initial State
const initialState = {
    payments: [],
    loading: false,
    error: null,
    selectedPayment: null,
};

// 2. Async Thunk Actions

/**
 * Fetch all payments
 */
export const fetchPayments = createAsyncThunk(
    'payment/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const data = await api.getPayments();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch payments');
        }
    }
);

/**
 * Add new payment
 */
export const addPayment = createAsyncThunk(
    'payment/add',
    async (paymentData, { rejectWithValue }) => {
        try {
            const newPayment = await api.createPayment(paymentData);
            return newPayment;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to add payment');
        }
    }
);

/**
 * Update payment
 */
export const updatePayment = createAsyncThunk(
    'payment/update',
    async ({ id, paymentData }, { rejectWithValue }) => {
        try {
            const updatedPayment = await api.updatePayment(id, paymentData);
            return updatedPayment;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update payment');
        }
    }
);

/**
 * Delete payment
 */
export const deletePayment = createAsyncThunk(
    'payment/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.deletePayment(id);
            return id; // Trả về id để xóa khỏi state
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete payment');
        }
    }
);

// 3. Create Slice
const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        // Synchronous actions
        selectPayment: (state, action) => {
            state.selectedPayment = action.payload;
        },
        clearSelectedPayment: (state) => {
            state.selectedPayment = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch payments cases
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
                state.error = null;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Add payment cases
            .addCase(addPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.payments.push(action.payload);
                state.error = null;
            })
            .addCase(addPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Update payment cases
            .addCase(updatePayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePayment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.payments.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.payments[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updatePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Delete payment cases
            .addCase(deletePayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePayment.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = state.payments.filter(p => p.id !== action.payload);
                state.error = null;
            })
            .addCase(deletePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// 4. Export actions và reducer
export const { selectPayment, clearSelectedPayment, clearError } = paymentSlice.actions;
export default paymentSlice.reducer;

// 5. Selectors
export const selectPayments = (state) => state.payment.payments;
export const selectPaymentLoading = (state) => state.payment.loading;
export const selectPaymentError = (state) => state.payment.error;
export const selectSelectedPayment = (state) => state.payment.selectedPayment;
