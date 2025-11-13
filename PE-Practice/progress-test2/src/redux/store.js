// store.js - Cấu hình Redux Store
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        payment: paymentReducer,
    },
    // Middleware mặc định đã bao gồm Redux Thunk
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Bỏ qua kiểm tra serializable cho một số actions nếu cần
                ignoredActions: ['auth/login/fulfilled'],
            },
        }),
});

export default store;
