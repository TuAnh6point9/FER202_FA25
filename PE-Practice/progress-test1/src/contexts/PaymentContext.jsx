// PaymentContext.jsx - Quản lý state và actions cho Payment CRUD
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as api from '../services/api';

// 1. Tạo Context
const PaymentContext = createContext();

// 2. Initial State
const initialState = {
    payments: [],
    loading: false,
    error: null,
    selectedPayment: null, // Để xem chi tiết
};

// 3. Reducer để quản lý actions
const paymentReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null };
        
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, payments: action.payload };
        
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload };
        
        case 'ADD_PAYMENT':
            return { 
                ...state, 
                payments: [...state.payments, action.payload],
                error: null 
            };
        
        case 'UPDATE_PAYMENT':
            return {
                ...state,
                payments: state.payments.map(payment =>
                    payment.id === action.payload.id ? action.payload : payment
                ),
                error: null
            };
        
        case 'DELETE_PAYMENT':
            return {
                ...state,
                payments: state.payments.filter(payment => payment.id !== action.payload),
                error: null
            };
        
        case 'SELECT_PAYMENT':
            return { ...state, selectedPayment: action.payload };
        
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        
        default:
            return state;
    }
};

// 4. Provider Component
export const PaymentProvider = ({ children }) => {
    const [state, dispatch] = useReducer(paymentReducer, initialState);

    // Fetch payments khi component mount
    useEffect(() => {
        fetchPayments();
    }, []);

    // Fetch all payments
    const fetchPayments = async () => {
        dispatch({ type: 'FETCH_START' });
        try {
            const data = await api.getPayments();
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    };

    // Add new payment
    const addPayment = async (paymentData) => {
        try {
            const newPayment = await api.createPayment(paymentData);
            dispatch({ type: 'ADD_PAYMENT', payload: newPayment });
            return { success: true, data: newPayment };
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    };

    // Update payment
    const updatePayment = async (id, paymentData) => {
        try {
            const updatedPayment = await api.updatePayment(id, paymentData);
            dispatch({ type: 'UPDATE_PAYMENT', payload: updatedPayment });
            return { success: true, data: updatedPayment };
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    };

    // Delete payment
    const deletePayment = async (id) => {
        try {
            await api.deletePayment(id);
            dispatch({ type: 'DELETE_PAYMENT', payload: id });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    };

    // Select payment for viewing details
    const selectPayment = (payment) => {
        dispatch({ type: 'SELECT_PAYMENT', payload: payment });
    };

    // Clear error
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    // Context value
    const contextValue = {
        payments: state.payments,
        loading: state.loading,
        error: state.error,
        selectedPayment: state.selectedPayment,
        
        // Actions
        fetchPayments,
        addPayment,
        updatePayment,
        deletePayment,
        selectPayment,
        clearError,
    };

    return (
        <PaymentContext.Provider value={contextValue}>
            {children}
        </PaymentContext.Provider>
    );
};

// 5. Custom hook để sử dụng PaymentContext
export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePayment must be used within PaymentProvider');
    }
    return context;
};
