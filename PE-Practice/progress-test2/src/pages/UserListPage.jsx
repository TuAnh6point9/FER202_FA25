// UserListPage.jsx - Trang quản lý Users
import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import NavigationHeader from './NavigationHeader';
import UserFilter from '../components/UserFilter';
import UserTable from '../components/UserTable';
import UserDetailsModal from '../components/UserDetailsModal';
import ConfirmModal from '../components/ConfirmModal';
import useSessionCheck from '../hooks/useSessionCheck'; // Import custom hook
import * as api from '../services/api';



const UserListPage = () => {
    // YÊU CẦU MỚI: Kiểm tra session - nếu bị ban sẽ tự động logout
    useSessionCheck();
    // State quản lý danh sách users
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');

    // State cho Modal
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // { userId, action: 'ban' | 'unban' }

    // State cho thông báo
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch users từ API khi component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Áp dụng filter và sort mỗi khi có thay đổi
    useEffect(() => {
        applyFiltersAndSort();
    }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

    // Hàm fetch users từ API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getUsers();
            setUsers(data);
        } catch (err) {
            setError('Không thể tải danh sách users. Vui lòng thử lại!');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    // Hàm áp dụng filter và sort
    const applyFiltersAndSort = () => {
        let result = [...users];

        // 1. Tìm kiếm theo username hoặc fullName
        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(
                (user) =>
                    user.username.toLowerCase().includes(lowerSearchTerm) ||
                    user.fullName.toLowerCase().includes(lowerSearchTerm)
            );
        }

        // 2. Lọc theo role
        if (roleFilter !== 'all') {
            result = result.filter((user) => user.role === roleFilter);
        }

        // 3. Lọc theo status
        if (statusFilter !== 'all') {
            result = result.filter((user) => user.status === statusFilter);
        }

        // 4. Sắp xếp
        result.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Chuyển về chữ thường nếu là string để so sánh
            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredUsers(result);
    };

    // Xử lý View Details
    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setShowDetailsModal(true);
    };

    // Xử lý đóng Details Modal
    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedUser(null);
    };

    // Xử lý Ban/Unban User (hiển thị Confirm Modal)
    const handleBanUser = (userId, action) => {
        const user = users.find((u) => u.id === userId);
        setSelectedUser(user);
        setConfirmAction({ userId, action });
        setShowConfirmModal(true);
    };

    // Xử lý xác nhận Ban/Unban
    const handleConfirmBanUnban = async () => {
        try {
            setShowConfirmModal(false);
            setLoading(true);

            if (confirmAction.action === 'ban') {
                await api.banUser(confirmAction.userId);
                setSuccessMessage(`✅ Đã khóa tài khoản "${selectedUser.username}" thành công!`);
            } else {
                await api.unbanUser(confirmAction.userId);
                setSuccessMessage(`✅ Đã mở khóa tài khoản "${selectedUser.username}" thành công!`);
            }

            // Refresh danh sách users
            await fetchUsers();

            // Tự động ẩn thông báo sau 3 giây
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Có lỗi xảy ra khi cập nhật tài khoản. Vui lòng thử lại!');
            console.error('Error banning/unbanning user:', err);
        } finally {
            setLoading(false);
            setConfirmAction(null);
            setSelectedUser(null);
        }
    };

    // Xử lý đóng Confirm Modal
    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
        setSelectedUser(null);
    };

    return (
        <>
            <NavigationHeader />
            <Container className="mt-4">
                <h2 className="mb-4">👥 Quản lý Users</h2>

                {/* Hiển thị thông báo thành công */}
                {successMessage && (
                    <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
                        {successMessage}
                    </Alert>
                )}

                {/* Hiển thị lỗi */}
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* UserFilter Component */}
                <UserFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    roleFilter={roleFilter}
                    onRoleFilterChange={setRoleFilter}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    sortOrder={sortOrder}
                    onSortOrderChange={setSortOrder}
                />

                {/* Loading Spinner */}
                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-2">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    // UserTable Component
                    <UserTable
                        users={filteredUsers}
                        onViewDetails={handleViewDetails}
                        onBanUser={handleBanUser}
                    />
                )}

                {/* UserDetailsModal */}
                <UserDetailsModal
                    show={showDetailsModal}
                    user={selectedUser}
                    onHide={handleCloseDetailsModal}
                />

                {/* ConfirmModal cho Ban/Unban */}
                <ConfirmModal
                    show={showConfirmModal}
                    title={confirmAction?.action === 'ban' ? '🚫 Xác nhận khóa tài khoản' : '✅ Xác nhận mở khóa tài khoản'}
                    message={
                        confirmAction?.action === 'ban'
                            ? `Bạn có chắc chắn muốn khóa tài khoản "${selectedUser?.username}"? User này sẽ không thể đăng nhập vào hệ thống.`
                            : `Bạn có chắc chắn muốn mở khóa tài khoản "${selectedUser?.username}"? User này sẽ có thể đăng nhập lại vào hệ thống.`
                    }
                    onConfirm={handleConfirmBanUnban}
                    onHide={handleCloseConfirmModal}
                    confirmText={confirmAction?.action === 'ban' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                    confirmVariant={confirmAction?.action === 'ban' ? 'danger' : 'success'}
                />
            </Container>
        </>
    );
};

export default UserListPage;
