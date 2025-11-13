// useSessionCheck.js - Custom hook để kiểm tra session của user
// Kiểm tra định kỳ xem user có bị ban trong khi đang logged in không
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, selectUser } from '../redux/slices/authSlice';
import * as api from '../services/api';

/**
 * Custom Hook: useSessionCheck
 * 
 * Mục đích:
 * - Kiểm tra định kỳ (mỗi 10 giây) xem user đang logged in có bị ban không
 * - Nếu bị ban → Hiển thị thông báo và tự động logout sau 3 giây
 * 
 * Use case:
 * - Admin A đang logged in
 * - Admin B ban tài khoản của Admin A
 * - Admin A sẽ thấy thông báo và bị logout tự động
 * 
 * Cách sử dụng:
 * - Import và gọi trong các component cần check session
 * - VD: DashboardPage, PaymentsPage, UserListPage
 */
const useSessionCheck = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const checkIntervalRef = useRef(null);
    const logoutTimeoutRef = useRef(null);

    useEffect(() => {
        // Chỉ check khi user đã logged in
        if (!user || !user.id) {
            return;
        }

        /**
         * Hàm kiểm tra status của user hiện tại
         */
        const checkUserStatus = async () => {
            try {
                // Fetch thông tin user mới nhất từ server
                const currentUser = await api.getUserById(user.id);

                // Kiểm tra nếu user bị ban (status !== 'active')
                if (currentUser.status !== 'active') {
                    // Clear interval để không check nữa
                    if (checkIntervalRef.current) {
                        clearInterval(checkIntervalRef.current);
                    }

                    // Hiển thị thông báo
                    alert('⚠️ Bạn đã bị khóa quyền truy cập. Hệ thống sẽ đăng xuất sau 3 giây...');

                    // Tự động logout sau 3 giây
                    logoutTimeoutRef.current = setTimeout(() => {
                        dispatch(logoutUser());
                        // Reload page để đảm bảo state được clear hoàn toàn
                        window.location.href = '/login';
                    }, 3000);
                }
            } catch (error) {
                // Nếu không fetch được user (có thể user đã bị xóa)
                // → Cũng logout để đảm bảo security
                console.error('Error checking user status:', error);
                
                // Có thể user đã bị xóa hoặc API lỗi
                // Để an toàn, logout user
                if (checkIntervalRef.current) {
                    clearInterval(checkIntervalRef.current);
                }
                
                alert('⚠️ Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
                
                logoutTimeoutRef.current = setTimeout(() => {
                    dispatch(logoutUser());
                    window.location.href = '/login';
                }, 2000);
            }
        };

        // Check ngay lập tức khi component mount
        checkUserStatus();

        // Sau đó check định kỳ mỗi 10 giây
        checkIntervalRef.current = setInterval(checkUserStatus, 10000);

        // Cleanup function khi component unmount
        return () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
            if (logoutTimeoutRef.current) {
                clearTimeout(logoutTimeoutRef.current);
            }
        };
    }, [user, dispatch]);
};

export default useSessionCheck;
