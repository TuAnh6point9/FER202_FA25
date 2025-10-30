import React, { createContext, useReducer, useContext, useEffect } from 'react';
import movieApi from '../api/movieAPI';

// 1. Tạo Context
const AuthContext = createContext();

// 2. Khởi tạo trạng thái ban đầu
const initialState = { 
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

// 3. Load user từ localStorage nếu có
const loadUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      return {
        ...initialState,
        user: JSON.parse(savedUser),
        isAuthenticated: true
      };
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
  }
  return initialState;
};

// 4. Định nghĩa hàm reducer
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { 
        ...state, 
        loading: true, 
        error: null 
      };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        user: action.payload, 
        loading: false, 
        error: null,
        isAuthenticated: true
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        user: null, 
        loading: false, 
        error: action.payload,
        isAuthenticated: false
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        loading: false, 
        error: null,
        isAuthenticated: false
      };
    case 'CLEAR_ERROR':
      return { 
        ...state, 
        error: null 
      };
    default: 
      return state;
  }
}

// 5. Tạo Provider Component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, loadUserFromStorage());

  // 6. Lưu user vào localStorage khi thay đổi
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('currentUser', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [state.user]);

  // 7. Hàm đăng nhập (lấy dữ liệu từ db.json qua json-server)
  async function login(identifier, password) {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Lấy danh sách accounts từ API
      const response = await movieApi.get('/accounts');
      const accounts = response.data;

      const isEmail = identifier.includes('@');
      
      // Tìm kiếm tài khoản theo email hoặc username
      const account = accounts.find(acc => {
        if (isEmail) {
          return acc.email === identifier && acc.password === password;
        } else {
          return acc.username === identifier && acc.password === password;
        }
      });

      if (!account) {
        dispatch({ 
          type: 'LOGIN_FAILURE', 
          payload: 'Invalid username/email or password.' 
        });
        return { ok: false, message: 'Invalid username/email or password.' };
      }

      // Kiểm tra trạng thái tài khoản
      if (account.status === 'locked') {
        dispatch({ 
          type: 'LOGIN_FAILURE', 
          payload: 'Account is locked. Please contact administrator.' 
        });
        return { ok: false, message: 'Account is locked. Please contact administrator.' };
      }

      // Đăng nhập thành công - Lưu thông tin user (không bao gồm password)
      const userInfo = {
        id: account.id,
        username: account.username,
        email: account.email,
        role: account.role,
        status: account.status
      };

      dispatch({ type: 'LOGIN_SUCCESS', payload: userInfo });
      return { ok: true, user: userInfo };

    } catch (error) {
      console.error('Login error:', error);
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'Failed to connect to server. Please try again.' 
      });
      return { ok: false, message: 'Failed to connect to server. Please try again.' };
    }
  }

  // 8. Hàm đăng xuất
  function logout() {
    dispatch({ type: 'LOGOUT' });
  }

  // 9. Hàm xóa lỗi
  function clearError() {
    dispatch({ type: 'CLEAR_ERROR' });
  }

  // 10. Context value
  const value = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 11. Custom hook để sử dụng AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
