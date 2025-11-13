# Redux Toolkit Implementation - Progress Test 2

## 📋 Tổng quan

Dự án đã được chuyển đổi từ **Context API** sang **Redux Toolkit** để quản lý state toàn cục cho:
- ✅ **Authentication** (đăng nhập, đăng xuất, quản lý user)
- ✅ **Payment Management** (CRUD operations cho payments)

---

## 🏗️ Cấu trúc Redux

```
src/
├── redux/
│   ├── store.js                 # Redux Store configuration
│   └── slices/
│       ├── authSlice.js         # Authentication slice (login, logout, user state)
│       └── paymentSlice.js      # Payment slice (CRUD operations)
```

---

## 🔧 Cài đặt

```bash
npm install @reduxjs/toolkit react-redux
```

---

## 📦 Redux Store (store.js)

### Setup Store

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        payment: paymentReducer,
    },
});
```

### Kết nối Store với React App (index.js)

```javascript
import { Provider } from 'react-redux';
import store from './redux/store';

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

---

## 🔐 Auth Slice (authSlice.js)

### 1. Initial State

```javascript
const initialState = {
    isAuthenticated: !!getUserFromLocalStorage(),
    user: getUserFromLocalStorage(),
    isLoading: false,
    error: null,
};
```

### 2. Async Thunk Actions

#### **loginUser** - Đăng nhập
```javascript
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ usernameOrEmail, password }, { rejectWithValue }) => {
        try {
            const accounts = await api.getUsers();
            const user = accounts.find(
                (acc) =>
                    (acc.username === usernameOrEmail || 
                     acc.email === usernameOrEmail) &&
                    acc.password === password
            );

            if (!user) return rejectWithValue('Invalid username/email or password!');
            if (user.role !== 'admin') return rejectWithValue('Chỉ Admin mới có thể đăng nhập!');
            if (user.status !== 'active') return rejectWithValue('Tài khoản đã bị khóa!');

            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
```

#### **logoutUser** - Đăng xuất
```javascript
export const logoutUser = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('user');
    return null;
});
```

### 3. Reducers & Extra Reducers

```javascript
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Logout cases
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
            });
    },
});
```

### 4. Selectors

```javascript
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
```

---

## 💳 Payment Slice (paymentSlice.js)

### 1. Initial State

```javascript
const initialState = {
    payments: [],
    loading: false,
    error: null,
    selectedPayment: null,
};
```

### 2. Async Thunk Actions

#### **fetchPayments** - Lấy danh sách payments
```javascript
export const fetchPayments = createAsyncThunk(
    'payment/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const data = await api.getPayments();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
```

#### **addPayment** - Thêm payment mới
```javascript
export const addPayment = createAsyncThunk(
    'payment/add',
    async (paymentData, { rejectWithValue }) => {
        try {
            const newPayment = await api.createPayment(paymentData);
            return newPayment;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
```

#### **updatePayment** - Cập nhật payment
```javascript
export const updatePayment = createAsyncThunk(
    'payment/update',
    async ({ id, paymentData }, { rejectWithValue }) => {
        try {
            const updatedPayment = await api.updatePayment(id, paymentData);
            return updatedPayment;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
```

#### **deletePayment** - Xóa payment
```javascript
export const deletePayment = createAsyncThunk(
    'payment/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.deletePayment(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
```

### 3. Reducers

```javascript
const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
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
        // Fetch, Add, Update, Delete cases...
    },
});
```

### 4. Selectors

```javascript
export const selectPayments = (state) => state.payment.payments;
export const selectPaymentLoading = (state) => state.payment.loading;
export const selectPaymentError = (state) => state.payment.error;
export const selectSelectedPayment = (state) => state.payment.selectedPayment;
```

---

## 🎯 Cách sử dụng trong Components

### 1. LoginForm.jsx

#### **Trước (Context API):**
```javascript
import { useAuth } from '../contexts/AuthContext';

const { login, loading, error, clearError, user } = useAuth();

const handleSubmit = async (e) => {
    const result = await login({ usernameOrEmail, password });
    if (result.success) {
        // Handle success
    }
};
```

#### **Sau (Redux Toolkit):**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, selectAuth } from '../redux/slices/authSlice';

const dispatch = useDispatch();
const { isLoading, error, user } = useSelector(selectAuth);

const handleSubmit = async (e) => {
    try {
        await dispatch(loginUser({ usernameOrEmail, password })).unwrap();
        // Handle success
    } catch (err) {
        // Handle error
    }
};
```

---

### 2. PaymentsPage.jsx

#### **Trước (Context API):**
```javascript
import { usePayment } from '../contexts/PaymentContext';

const { 
    payments, 
    loading, 
    error, 
    fetchPayments, 
    selectPayment 
} = usePayment();

useEffect(() => {
    fetchPayments();
}, []);
```

#### **Sau (Redux Toolkit):**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchPayments, 
    selectPayment, 
    selectPayments 
} from '../redux/slices/paymentSlice';

const dispatch = useDispatch();
const payments = useSelector(selectPayments);

useEffect(() => {
    dispatch(fetchPayments());
}, [dispatch]);
```

---

### 3. PaymentTable.jsx - Delete Payment

#### **Trước (Context API):**
```javascript
const { deletePayment } = usePayment();

const handleConfirmDelete = async () => {
    const result = await deletePayment(selectedPaymentId);
    if (result.success) {
        // Success
    } else {
        alert('Failed: ' + result.error);
    }
};
```

#### **Sau (Redux Toolkit):**
```javascript
import { deletePayment } from '../redux/slices/paymentSlice';

const dispatch = useDispatch();

const handleConfirmDelete = async () => {
    try {
        await dispatch(deletePayment(selectedPaymentId)).unwrap();
        // Success
    } catch (err) {
        alert('Failed: ' + err);
    }
};
```

---

### 4. NavigationHeader.jsx - Logout

#### **Trước (Context API):**
```javascript
import { useAuth } from '../contexts/AuthContext';

const { user, logout } = useAuth();

const handleLogout = () => {
    logout();
    navigate('/login');
};
```

#### **Sau (Redux Toolkit):**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, selectUser } from '../redux/slices/authSlice';

const dispatch = useDispatch();
const user = useSelector(selectUser);

const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
};
```

---

### 5. Protected Routes (AppRoutes.jsx)

#### **Trước (Context API):**
```javascript
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};
```

#### **Sau (Redux Toolkit):**
```javascript
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" />;
};
```

---

## 📊 So sánh Context API vs Redux Toolkit

| Tiêu chí | Context API | Redux Toolkit |
|----------|-------------|---------------|
| **Setup** | Ít code hơn, đơn giản | Nhiều boilerplate hơn một chút |
| **Performance** | Re-render nhiều hơn | Optimize tốt hơn với selectors |
| **DevTools** | Không có | Redux DevTools mạnh mẽ |
| **Async Logic** | Tự handle trong Context | createAsyncThunk built-in |
| **Type Safety** | Cần TypeScript manual | RTK Query + TypeScript tốt |
| **Middleware** | Tự implement | Redux Thunk built-in |
| **Code Organization** | Dễ bị scattered | Slices giúp tổ chức tốt hơn |
| **Learning Curve** | Dễ học | Cần học concepts Redux |

---

## 🎓 Ưu điểm của Redux Toolkit

### 1. **Better Performance**
- Selectors giúp tối ưu re-renders
- Chỉ components subscribe đến slice cụ thể mới re-render

### 2. **Redux DevTools**
```javascript
// Xem toàn bộ history của actions
// Time-travel debugging
// Inspect state changes
```

### 3. **createAsyncThunk**
- Tự động handle pending/fulfilled/rejected states
- Không cần viết try-catch nhiều lần
- Error handling chuẩn hóa

### 4. **Immer Integration**
```javascript
// Có thể "mutate" state trực tiếp
state.payments.push(action.payload); // OK with Redux Toolkit
// Immer sẽ convert thành immutable updates
```

### 5. **TypeScript Support**
```typescript
// Type inference tự động
const user = useSelector(selectUser); // TypeScript biết type của user
```

---

## 🔍 Redux DevTools Usage

### Cài đặt Extension
- Chrome: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- Firefox: [Redux DevTools](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

### Features
1. **Action History**: Xem tất cả actions đã dispatch
2. **State Inspector**: Xem state sau mỗi action
3. **Time Travel**: Quay lại state trước đó
4. **Action Replay**: Replay lại actions
5. **State Diff**: So sánh state changes

---

## 🧪 Testing với Redux Toolkit

### Setup Test Store
```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';

export const setupTestStore = (preloadedState) => {
    return configureStore({
        reducer: { auth: authReducer },
        preloadedState,
    });
};
```

### Test Component với Redux
```javascript
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

const renderWithRedux = (component, initialState) => {
    const store = setupTestStore(initialState);
    return render(<Provider store={store}>{component}</Provider>);
};
```

---

## 📝 Best Practices

### 1. **Organize Slices by Feature**
```
slices/
├── authSlice.js       # Authentication
├── paymentSlice.js    # Payments
├── userSlice.js       # User management
```

### 2. **Use Selectors**
```javascript
// ✅ Good - Reusable selector
const selectActivePayments = (state) => 
    state.payment.payments.filter(p => p.status === 'active');

// ❌ Bad - Logic in component
const activePayments = payments.filter(p => p.status === 'active');
```

### 3. **Handle Loading States**
```javascript
{loading && <Spinner />}
{error && <Alert variant="danger">{error}</Alert>}
{!loading && !error && <PaymentList />}
```

### 4. **Use .unwrap() for Error Handling**
```javascript
try {
    const result = await dispatch(loginUser(credentials)).unwrap();
    // Success - result chứa payload
} catch (err) {
    // Error - err chứa rejectWithValue
}
```

### 5. **Memoize Selectors with createSelector**
```javascript
import { createSelector } from '@reduxjs/toolkit';

const selectPayments = (state) => state.payment.payments;
const selectFilter = (state) => state.payment.filter;

const selectFilteredPayments = createSelector(
    [selectPayments, selectFilter],
    (payments, filter) => payments.filter(p => p.status === filter)
);
```

---

## 🚀 Migration Checklist

- ✅ Cài đặt `@reduxjs/toolkit` và `react-redux`
- ✅ Tạo Redux store (`store.js`)
- ✅ Tạo Auth Slice (`authSlice.js`)
- ✅ Tạo Payment Slice (`paymentSlice.js`)
- ✅ Wrap App với `<Provider store={store}>`
- ✅ Cập nhật LoginForm sử dụng Redux hooks
- ✅ Cập nhật PaymentsPage sử dụng Redux hooks
- ✅ Cập nhật PaymentTable sử dụng Redux hooks
- ✅ Cập nhật NavigationHeader sử dụng Redux hooks
- ✅ Cập nhật AppRoutes sử dụng Redux selectors
- ✅ Cập nhật DashboardPage sử dụng Redux selectors
- ✅ Cập nhật useSessionCheck sử dụng Redux hooks
- ✅ Cập nhật AddPayment sử dụng Redux dispatch
- ✅ Cập nhật UserTable sử dụng Redux selectors
- ✅ Xóa hoặc giữ lại Context files (optional)
- ✅ Test toàn bộ chức năng

---

## 📚 Tài liệu tham khảo

- [Redux Toolkit Official Docs](https://redux-toolkit.js.org/)
- [React-Redux Hooks API](https://react-redux.js.org/api/hooks)
- [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)
- [createSlice](https://redux-toolkit.js.org/api/createSlice)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

---

## 🎉 Kết luận

Redux Toolkit đã được áp dụng thành công vào dự án progress-test2, thay thế Context API với:
- ✅ Code tổ chức tốt hơn (slices)
- ✅ Performance tối ưu hơn (selectors)
- ✅ DevTools mạnh mẽ (debugging)
- ✅ Async logic chuẩn hóa (createAsyncThunk)
- ✅ Type safety tốt hơn (TypeScript ready)

---

**Author:** FER202 - FA25  
**Date:** November 2025
