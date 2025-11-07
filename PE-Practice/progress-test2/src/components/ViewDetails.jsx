// ViewDetails.jsx - Hiển thị chi tiết payment
import React from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';

const ViewDetails = ({ show, payment, onHide }) => {
    if (!payment) return null;

    // Format currency VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Payment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-3">
                    <Col md={6}>
                        <h6 className="text-muted mb-1">Payment ID</h6>
                        <p className="fw-bold">#{payment.id}</p>
                    </Col>
                    <Col md={6}>
                        <h6 className="text-muted mb-1">Status</h6>
                        <Badge 
                            bg={
                                payment.status === 'Paid' 
                                    ? 'success' 
                                    : payment.status === 'Pending' 
                                    ? 'warning' 
                                    : 'danger'
                            }
                            className="fs-6"
                        >
                            {payment.status || 'N/A'}
                        </Badge>
                    </Col>
                </Row>

                <hr />

                <Row className="mb-3">
                    <Col md={6}>
                        <h6 className="text-muted mb-1">Semester</h6>
                        <p className="fw-bold">{payment.semester}</p>
                    </Col>
                    <Col md={6}>
                        <h6 className="text-muted mb-1">Course</h6>
                        <p className="fw-bold">{payment.courseName}</p>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <h6 className="text-muted mb-1">Amount</h6>
                        <p className="fw-bold text-success fs-5">
                            {formatCurrency(payment.amount)}
                        </p>
                    </Col>
                    <Col md={6}>
                        <h6 className="text-muted mb-1">Date</h6>
                        <p className="fw-bold">{formatDate(payment.date)}</p>
                    </Col>
                </Row>

                {payment.description && (
                    <Row className="mb-3">
                        <Col>
                            <h6 className="text-muted mb-1">Description</h6>
                            <p className="bg-light p-3 rounded">
                                {payment.description || 'No description provided'}
                            </p>
                        </Col>
                    </Row>
                )}

                {payment.createdAt && (
                    <Row className="mb-3">
                        <Col>
                            <h6 className="text-muted mb-1">Created At</h6>
                            <p className="text-muted small">
                                {formatDate(payment.createdAt)}
                            </p>
                        </Col>
                    </Row>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewDetails;
