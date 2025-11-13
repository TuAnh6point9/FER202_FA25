// PaymentsPage.jsx - Trang chính quản lý payments
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import NavigationHeader from './NavigationHeader';
import PaymentTable from '../components/PaymentTable';
import ViewDetails from '../components/ViewDetails';
import useSessionCheck from '../hooks/useSessionCheck';
import { fetchPayments, selectPayment, selectSelectedPayment } from '../redux/slices/paymentSlice';

const PaymentsPage = () => {
    useSessionCheck();
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedPayment = useSelector(selectSelectedPayment);
    const [showDetails, setShowDetails] = useState(false);

    // Fetch payments khi component mount
    useEffect(() => {
        dispatch(fetchPayments());
    }, [dispatch]);

    // Handle view details
    const handleViewDetails = (payment) => {
        dispatch(selectPayment(payment));
        setShowDetails(true);
    };

    // Handle close details modal
    const handleCloseDetails = () => {
        setShowDetails(false);
    };

    // Handle edit payment
    const handleEdit = (payment) => {
        navigate(`/payments/edit/${payment.id}`, { state: { payment } });
    };

    // Handle add new payment
    const handleAddNew = () => {
        navigate('/payments/add');
    };

    return (
        <>
            {/* Navigation Header */}
            <NavigationHeader />

            {/* Main Content */}
            <Container className="py-4">
                <Card className="shadow-sm">
                    <Card.Header className="bg-primary text-white">
                        <Row className="align-items-center">
                            <Col>
                                <h4 className="mb-0">Payment Management</h4>
                            </Col>
                            <Col xs="auto">
                                <Button 
                                    variant="light" 
                                    size="sm"
                                    onClick={handleAddNew}
                                >
                                    <FaPlus className="me-2" />
                                    Add Payment
                                </Button>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <PaymentTable 
                            onViewDetails={handleViewDetails}
                            onEdit={handleEdit}
                        />
                    </Card.Body>
                </Card>
            </Container>

            {/* View Details Modal */}
            <ViewDetails
                show={showDetails}
                payment={selectedPayment}
                onHide={handleCloseDetails}
            />
        </>
    );
};

export default PaymentsPage;
