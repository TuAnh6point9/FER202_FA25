// UserFilter.jsx - Component cho phép tìm kiếm, lọc và sắp xếp danh sách users
import React from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';

/**
 * Component UserFilter
 * 
 * Props:
 * - searchTerm: Từ khóa tìm kiếm hiện tại
 * - onSearchChange: Hàm xử lý khi thay đổi từ khóa tìm kiếm
 * - roleFilter: Role filter hiện tại ('all', 'admin', 'user')
 * - onRoleFilterChange: Hàm xử lý khi thay đổi role filter
 * - statusFilter: Status filter hiện tại ('all', 'active', 'blocked', 'locked')
 * - onStatusFilterChange: Hàm xử lý khi thay đổi status filter
 * - sortBy: Tiêu chí sắp xếp ('id', 'username', 'fullName', 'role', 'status')
 * - onSortChange: Hàm xử lý khi thay đổi tiêu chí sắp xếp
 * - sortOrder: Thứ tự sắp xếp ('asc', 'desc')
 * - onSortOrderChange: Hàm xử lý khi thay đổi thứ tự sắp xếp
 */
const UserFilter = ({
    searchTerm,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
    statusFilter,
    onStatusFilterChange,
    sortBy,
    onSortChange,
    sortOrder,
    onSortOrderChange
}) => {
    return (
        <div className="mb-4 p-3 bg-light rounded">
            <h5 className="mb-3">🔍 Tìm kiếm và Lọc Users</h5>
            <Row className="g-3">
                {/* Tìm kiếm theo Username hoặc Full Name */}
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Tìm kiếm</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>
                                <i className="bi bi-search"></i> 🔍
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Tìm theo username hoặc họ tên..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                </Col>

                {/* Lọc theo Role */}
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                            value={roleFilter}
                            onChange={(e) => onRoleFilterChange(e.target.value)}
                        >
                            <option value="all">Tất cả</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Lọc theo Status */}
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            value={statusFilter}
                            onChange={(e) => onStatusFilterChange(e.target.value)}
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                            <option value="locked">Locked</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Sắp xếp theo */}
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Sắp xếp theo</Form.Label>
                        <Form.Select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                        >
                            <option value="id">ID</option>
                            <option value="username">Username</option>
                            <option value="fullName">Họ và Tên</option>
                            <option value="role">Role</option>
                            <option value="status">Status</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Thứ tự sắp xếp */}
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Thứ tự</Form.Label>
                        <Form.Select
                            value={sortOrder}
                            onChange={(e) => onSortOrderChange(e.target.value)}
                        >
                            <option value="asc">Tăng dần (A-Z, 0-9)</option>
                            <option value="desc">Giảm dần (Z-A, 9-0)</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
};

export default UserFilter;
