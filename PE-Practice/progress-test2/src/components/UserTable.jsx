// UserTable.jsx - Component hiển thị danh sách users dưới dạng bảng
import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';

/**
 * Component UserTable
 * 
 * Hiển thị danh sách users dưới dạng bảng với các cột:
 * - ID
 * - Username
 * - Full Name
 * - Role (với adminLevel nếu là admin)
 * - Status
 * - Action (View Details, Ban/Unban Account)
 * 
 * RULES MỚI:
 * 1. Admin KHÔNG THỂ ban/unban chính mình
 * 2. Admin có hierarchy theo adminLevel (số càng nhỏ càng cao):
 *    - adminLevel 1 (Super Admin - nam123) > adminLevel 2 (Admin - thanh123)
 *    - Admin chỉ có thể ban admin có adminLevel THẤP HƠN (số lớn hơn)
 *    - VD: nam123 (level 1) CÓ THỂ ban thanh123 (level 2)
 *    - VD: thanh123 (level 2) KHÔNG THỂ ban nam123 (level 1)
 * 
 * Props:
 * - users: Mảng danh sách users đã được lọc và sắp xếp
 * - onViewDetails: Hàm xử lý khi click "View Details"
 * - onBanUser: Hàm xử lý khi click "Ban Account" hoặc "Unban Account"
 */
const UserTable = ({ users, onViewDetails, onBanUser }) => {
    const currentUser = useSelector(selectUser); // Lấy thông tin user đang logged in

    // Hàm hiển thị Badge cho Role với adminLevel
    const getRoleBadge = (role, adminLevel) => {
        if (role === 'admin') {
            const levelText = adminLevel === 1 ? ' (Super Admin)' : adminLevel ? ` (Level ${adminLevel})` : '';
            return <Badge bg="danger">Admin{levelText}</Badge>;
        }
        return <Badge bg="info">User</Badge>;
    };

    // Hàm hiển thị Badge cho Status
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <Badge bg="success">Active</Badge>;
            case 'blocked':
                return <Badge bg="danger">Blocked</Badge>;
            case 'locked':
                return <Badge bg="warning" text="dark">Locked</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    /**
     * Hàm kiểm tra xem có thể ban/unban user này không
     * 
     * RULES:
     * 1. Không thể ban chính mình
     * 2. Nếu target là admin:
     *    - Current user phải là admin
     *    - Current user phải có adminLevel THẤP HƠN (số nhỏ hơn) target user
     * 
     * @param {Object} targetUser - User cần kiểm tra
     * @returns {Object} { canBan: boolean, reason: string }
     */
    const canBanUser = (targetUser) => {
        // Rule 1: Không thể ban chính mình
        if (currentUser.id === targetUser.id) {
            return {
                canBan: false,
                reason: 'Bạn không thể khóa chính mình!'
            };
        }

        // Rule 2: Kiểm tra adminLevel nếu target là admin
        if (targetUser.role === 'admin') {
            // Current user phải là admin
            if (currentUser.role !== 'admin') {
                return {
                    canBan: false,
                    reason: 'Chỉ Admin mới có thể khóa Admin khác!'
                };
            }

            // Kiểm tra hierarchy: adminLevel càng nhỏ thì quyền càng cao
            const currentLevel = currentUser.adminLevel || 999; // Default level rất thấp nếu không có
            const targetLevel = targetUser.adminLevel || 999;

            if (currentLevel >= targetLevel) {
                return {
                    canBan: false,
                    reason: `Bạn không có quyền khóa ${targetUser.username}. ${targetUser.username} có quyền cao hơn hoặc ngang bằng bạn.`
                };
            }
        }

        // Passed all checks
        return { canBan: true, reason: '' };
    };

    return (
        <div>
            <h5 className="mb-3">👥 Danh sách Users ({users.length})</h5>
            
            {users.length === 0 ? (
                <div className="alert alert-info">
                    Không tìm thấy user nào phù hợp với tiêu chí lọc.
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th style={{ width: '60px' }}>ID</th>
                            <th style={{ width: '80px' }}>Avatar</th>
                            <th style={{ width: '150px' }}>Username</th>
                            <th>Họ và Tên</th>
                            <th style={{ width: '150px' }}>Role</th>
                            <th style={{ width: '120px' }}>Status</th>
                            <th style={{ width: '280px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            const banCheck = canBanUser(user);
                            
                            return (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td className="text-center">
                                        <img
                                            src={user.avatar || 'https://via.placeholder.com/50?text=No+Img'}
                                            alt={user.fullName}
                                            className="rounded-circle"
                                            style={{ 
                                                width: '50px', 
                                                height: '50px', 
                                                objectFit: 'cover',
                                                border: '2px solid #dee2e6'
                                            }}
                                            onError={(e) => {
                                                console.log(`Failed to load avatar for ${user.username}:`, user.avatar);
                                                e.target.onerror = null; // Prevent infinite loop
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&size=50&background=0D6EFD&color=fff&bold=true`;
                                            }}
                                        />
                                    </td>
                                    <td>{user.username}</td>
                                    <td>{user.fullName}</td>
                                    <td className="text-center">{getRoleBadge(user.role, user.adminLevel)}</td>
                                    <td className="text-center">{getStatusBadge(user.status)}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {/* Button View Details */}
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => onViewDetails(user)}
                                            >
                                                👁️ View Details
                                            </Button>
                                            
                                            {/* Button Ban/Unban Account */}
                                            {user.status === 'blocked' ? (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (banCheck.canBan) {
                                                            onBanUser(user.id, 'unban');
                                                        } else {
                                                            alert(banCheck.reason);
                                                        }
                                                    }}
                                                    disabled={!banCheck.canBan}
                                                    title={!banCheck.canBan ? banCheck.reason : 'Mở khóa tài khoản'}
                                                >
                                                    ✅ Unban Account
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (banCheck.canBan) {
                                                            onBanUser(user.id, 'ban');
                                                        } else {
                                                            alert(banCheck.reason);
                                                        }
                                                    }}
                                                    disabled={!banCheck.canBan}
                                                    title={!banCheck.canBan ? banCheck.reason : 'Khóa tài khoản'}
                                                >
                                                    🚫 Ban Account
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default UserTable;
