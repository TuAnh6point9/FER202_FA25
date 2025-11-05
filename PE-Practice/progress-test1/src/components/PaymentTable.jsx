// PaymentTable.jsx - Hiển thị danh sách payments dưới dạng bảng
import React, { useState } from 'react';
import { Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { usePayment } from '../contexts/PaymentContext';
import ConfirmModal from './ConfirmModal';

const PaymentTable = ({ onViewDetails, onEdit }) => {
    const { payments, loading, error, deletePayment } = usePayment();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Xử lý xóa payment
    const handleDeleteClick = (id) => {
        setSelectedPaymentId(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setDeleteLoading(true);
        const result = await deletePayment(selectedPaymentId);
        setDeleteLoading(false);
        
        if (result.success) {
            setShowDeleteModal(false);
            setSelectedPaymentId(null);
        } else {
            alert('Failed to delete payment: ' + result.error);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedPaymentId(null);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Render loading state
    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading payments...</p>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <Alert variant="danger">
                <Alert.Heading>Error!</Alert.Heading>
                <p>{error}</p>
            </Alert>
        );
    }

    // Render empty state
    if (payments.length === 0) {
        return (
            <Alert variant="info">
                <Alert.Heading>No Payments Found</Alert.Heading>
                <p>There are no payment records yet. Click "Add Payment" to create one.</p>
            </Alert>
        );
    }

    return (
        <>
            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Semester</th>
                        <th>Course</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment, index) => (
                        <tr key={payment.id}>
                            <td>{index + 1}</td>
                            <td>{payment.semester}</td>
                            <td>{payment.courseName}</td>
                            <td className="fw-bold">{formatCurrency(payment.amount)}</td>
                            <td>
                                <Badge 
                                    bg={payment.status === 'Paid' ? 'success' : payment.status === 'Pending' ? 'warning' : 'danger'}
                                >
                                    {payment.status || 'N/A'}
                                </Badge>
                            </td>
                            <td>{new Date(payment.date).toLocaleDateString()}</td>
                            <td className="text-center">
                                <Button
                                    variant="info"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onViewDetails(payment)}
                                    title="View Details"
                                >
                                    <FaEye />
                                </Button>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onEdit(payment)}
                                    title="Edit"
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteClick(payment.id)}
                                    title="Delete"
                                >
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                show={showDeleteModal}
                title="Confirm Delete"
                message="Are you sure you want to delete this payment? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onHide={handleCancelDelete}
                loading={deleteLoading}
            />
        </>
    );
};

export default PaymentTable;
