// AddPayment.jsx - Form để thêm payment mới
import React, { useReducer } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../contexts/PaymentContext';

// Initial form state
const initialFormState = {
    formData: {
        semester: '',
        courseName: '',
        amount: '',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        description: '',
    },
    errors: {},
    isSubmitting: false,
};

// Form reducer
function formReducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                formData: {
                    ...state.formData,
                    [action.field]: action.value,
                },
                errors: {
                    ...state.errors,
                    [action.field]: '', // Clear error khi user nhập
                }
            };
        
        case 'SET_ERROR':
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.field]: action.message,
                },
            };
        
        case 'SET_ERRORS':
            return {
                ...state,
                errors: action.errors,
            };
        
        case 'SET_SUBMITTING':
            return {
                ...state,
                isSubmitting: action.value,
            };
        
        case 'RESET_FORM':
            return initialFormState;
        
        default:
            return state;
    }
}

const AddPayment = () => {
    const [state, dispatch] = useReducer(formReducer, initialFormState);
    const { addPayment } = usePayment();
    const navigate = useNavigate();

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!state.formData.semester.trim()) {
            newErrors.semester = 'Semester is required';
        }

        if (!state.formData.courseName.trim()) {
            newErrors.courseName = 'Course is required';
        }

        if (!state.formData.amount || parseFloat(state.formData.amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount greater than 0';
        }

        if (!state.formData.date) {
            newErrors.date = 'Date is required';
        }

        if (Object.keys(newErrors).length > 0) {
            dispatch({ type: 'SET_ERRORS', errors: newErrors });
            return false;
        }

        return true;
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: 'SET_FIELD', field: name, value });
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        dispatch({ type: 'SET_SUBMITTING', value: true });

        const paymentData = {
            ...state.formData,
            amount: parseFloat(state.formData.amount),
        };

        const result = await addPayment(paymentData);

        dispatch({ type: 'SET_SUBMITTING', value: false });

        if (result.success) {
            alert('Payment added successfully!');
            navigate('/payments'); // Navigate to payments list page
        } else {
            alert('Failed to add payment: ' + result.error);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        navigate('/payments');
    };

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow">
                        <Card.Header as="h4" className="bg-primary text-white">
                            Add New Payment
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                {/* Semester */}
                                <Form.Group className="mb-3" controlId="semester">
                                    <Form.Label>Semester <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="semester"
                                        placeholder="e.g., Fall 2024, Spring 2025"
                                        value={state.formData.semester}
                                        onChange={handleChange}
                                        isInvalid={!!state.errors.semester}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {state.errors.semester}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* Course */}
                                <Form.Group className="mb-3" controlId="courseName">
                                    <Form.Label>Course <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="courseName"
                                        placeholder="e.g., FER202, PRJ301"
                                        value={state.formData.courseName}
                                        onChange={handleChange}
                                        isInvalid={!!state.errors.courseName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {state.errors.courseName}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* Amount */}
                                <Form.Group className="mb-3" controlId="amount">
                                    <Form.Label>Amount (USD) <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        value={state.formData.amount}
                                        onChange={handleChange}
                                        isInvalid={!!state.errors.amount}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {state.errors.amount}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* Status */}
                                <Form.Group className="mb-3" controlId="status">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={state.formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Overdue">Overdue</option>
                                    </Form.Select>
                                </Form.Group>

                                {/* Date */}
                                <Form.Group className="mb-3" controlId="date">
                                    <Form.Label>Date <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="date"
                                        value={state.formData.date}
                                        onChange={handleChange}
                                        isInvalid={!!state.errors.date}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {state.errors.date}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* Description */}
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        placeholder="Additional notes or description"
                                        value={state.formData.description}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                {/* Buttons */}
                                <div className="d-flex justify-content-end gap-2">
                                    <Button 
                                        variant="secondary" 
                                        onClick={handleCancel}
                                        disabled={state.isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        disabled={state.isSubmitting}
                                    >
                                        {state.isSubmitting ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="me-2"
                                                />
                                                Adding...
                                            </>
                                        ) : (
                                            'Add Payment'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddPayment;
