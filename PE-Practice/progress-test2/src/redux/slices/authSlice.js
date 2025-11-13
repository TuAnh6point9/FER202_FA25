// authSlice.js - Redux Toolkit slice cho Authentication
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// 1. Khôi phục user từ localStorage khi khởi tạo
const getUserFromLocalStorage = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error loading user from localStorage:', error);
        return null;
    }
};

// 2. Initial State
const initialState = {
    isAuthenticated: !!getUserFromLocalStorage(),
    user: getUserFromLocalStorage(),
    isLoading: false,
    error: null,
};

// 3. Async Thunk Actions - Xử lý logic bất đồng bộ
// createAsyncThunk tự động tạo 3 action types: pending, fulfilled, rejected

/**
 * Login Async Thunk
 * Nhận { usernameOrEmail, password } và xử lý đăng nhập
 */
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ usernameOrEmail, password }, { rejectWithValue }) => {
        try {
            // 1. Gọi API để lấy danh sách users
            const accounts = await api.getUsers();
            
            // 2. Tìm user theo username HOẶC email
            const user = accounts.find(
                (acc) =>
                    (acc.username === usernameOrEmail || 
                     (acc.email && acc.email === usernameOrEmail)) &&
                    acc.password === password
            );

            // 3. Kiểm tra thông tin đăng nhập
            if (!user) {
                return rejectWithValue('Invalid username/email or password!');
            }

            // 4. Kiểm tra role (chỉ admin mới được đăng nhập)
            if (user.role !== 'admin') {
                return rejectWithValue('Bạn không có quyền truy cập. Chỉ Admin mới có thể đăng nhập!');
            }

            // 5. Kiểm tra status (tài khoản phải active)
            if (user.status !== 'active') {
                return rejectWithValue('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!');
            }

            // 6. Lưu user vào localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // 7. Trả về user data
            return user;
        } catch (error) {
            return rejectWithValue(error.message || 'Login failed due to a network error.');
        }
    }
);

/**
 * Logout Action - Không cần async vì chỉ xóa localStorage
 */
export const logoutUser = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('user');
    return null;
});

// 4. Create Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Synchronous actions
        clearError: (state) => {
            state.error = null;
        },
        // Action để restore user từ localStorage (optional)
        restoreUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
    },
    extraReducers: (builder) => {
        // Login cases
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload || 'Login failed';
            })
            
            // Logout cases
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
            });
    },
});

// 5. Export actions và reducer
export const { clearError, restoreUser } = authSlice.actions;
export default authSlice.reducer;

// 6. Selectors - Để lấy data từ state dễ dàng hơn
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
