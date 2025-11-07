// UserDetailsModal.jsx - Modal hiển thị thông tin chi tiết của user
import React from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';

/**
 * Component UserDetailsModal
 * 
 * Modal hiển thị thông tin chi tiết của user khi click "View Details"
 * 
 * Props:
 * - show: Boolean để hiển thị/ẩn modal
 * - user: Object chứa thông tin user cần hiển thị
 * - onHide: Hàm xử lý khi đóng modal
 */
const UserDetailsModal = ({ show, user, onHide }) => {
    if (!user) return null;

    // Hàm hiển thị Badge cho Role với adminLevel
    const getRoleBadge = (role, adminLevel) => {
        if (role === 'admin') {
            const levelText = adminLevel === 1 ? ' (Super Admin)' : adminLevel ? ` (Level ${adminLevel})` : '';
            return <Badge bg="danger" className="fs-6">Admin{levelText}</Badge>;
        }
        return <Badge bg="info" className="fs-6">User</Badge>;
    };

    // Hàm hiển thị Badge cho Status
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <Badge bg="success" className="fs-6">Active</Badge>;
            case 'blocked':
                return <Badge bg="danger" className="fs-6">Blocked</Badge>;
            case 'locked':
                return <Badge bg="warning" text="dark" className="fs-6">Locked</Badge>;
            default:
                return <Badge bg="secondary" className="fs-6">{status}</Badge>;
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>👤 Chi tiết User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-3">
                    <Col md={3}>
                        <div className="text-center">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.fullName}
                                    className="rounded-circle"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/120?text=No+Avatar';
                                    }}
                                />
                            ) : (
                                <div
                                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                                    style={{ width: '120px', height: '120px', margin: '0 auto' }}
                                >
                                    <span className="text-white fs-1">
                                        {user.fullName?.charAt(0) || '?'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col md={9}>
                        <h4>{user.fullName}</h4>
                        <p className="text-muted mb-1">@{user.username}</p>
                        <div className="mb-2">
                            {getRoleBadge(user.role, user.adminLevel)} {getStatusBadge(user.status)}
                        </div>
                    </Col>
                </Row>

                <hr />

                <Row className="g-3">
                    <Col md={6}>
                        <strong>🆔 User ID:</strong>
                        <p>{user.id}</p>
                    </Col>
                    <Col md={6}>
                        <strong>👤 Username:</strong>
                        <p>{user.username}</p>
                    </Col>
                    <Col md={6}>
                        <strong>📛 Họ và Tên:</strong>
                        <p>{user.fullName}</p>
                    </Col>
                    <Col md={6}>
                        <strong>🔐 Password:</strong>
                        <p>{'*'.repeat(user.password?.length || 6)}</p>
                    </Col>
                    <Col md={6}>
                        <strong>👑 Role:</strong>
                        <p>{getRoleBadge(user.role, user.adminLevel)}</p>
                    </Col>
                    {user.role === 'admin' && user.adminLevel && (
                        <Col md={6}>
                            <strong>🎖️ Admin Level:</strong>
                            <p>
                                Level {user.adminLevel}
                                {user.adminLevel === 1 && ' (Super Admin - Quyền cao nhất)'}
                            </p>
                        </Col>
                    )}
                    <Col md={6}>
                        <strong>📊 Status:</strong>
                        <p>{getStatusBadge(user.status)}</p>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserDetailsModal;
