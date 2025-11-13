//AppRoutes.js định nghĩa các route cho ứng dụng sử dụng React Router
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/slices/authSlice';
import LoginPage from '../components/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PaymentsPage from '../pages/PaymentsPage';
import AddPayment from '../components/AddPayment';
import UserListPage from '../pages/UserListPage'; // YÊU CẦU MỚI: Import UserListPage

// Component để bảo vệ các route cần xác thực
const PrivateRoute = ({ children }) => {
    // Lấy trực tiếp isAuthenticated từ Redux store
    const isAuthenticated = useSelector(selectIsAuthenticated); 
    
    // Nếu chưa đăng nhập, chuyển hướng đến /login
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* 1. Trang mặc định: Chuyển hướng đến /home nếu đã đăng nhập, ngược lại là /login */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                
                {/* 2. Trang Đăng nhập */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* 3. Định nghĩa route bảo vệ cho Trang Chủ/Dashboard (yêu cầu: /home ) */}
                <Route 
                    path="/home" 
                    element={
                        <PrivateRoute>
                            {/* Component Trang chủ/Dashboard */}
                            <DashboardPage /> 
                        </PrivateRoute>
                    } 
                />
                
                {/* 4. Payment Routes */}
                <Route 
                    path="/payments" 
                    element={
                        <PrivateRoute>
                            <PaymentsPage /> 
                        </PrivateRoute>
                    } 
                />
                
                <Route 
                    path="/payments/add" 
                    element={
                        <PrivateRoute>
                            <AddPayment /> 
                        </PrivateRoute>
                    } 
                />
                
                {/* YÊU CẦU MỚI: Route cho User Management */}
                <Route 
                    path="/users" 
                    element={
                        <PrivateRoute>
                            <UserListPage /> 
                        </PrivateRoute>
                    } 
                />
                
                {/* 5. Xử lý tất cả các đường dẫn không xác định: Chuyển hướng đến /home */}
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
