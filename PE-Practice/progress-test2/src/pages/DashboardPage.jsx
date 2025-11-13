import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Table, Spinner, Alert, Form } from 'react-bootstrap'; 
import NavigationHeader from './NavigationHeader';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import useSessionCheck from '../hooks/useSessionCheck';
import * as api from '../services/api';

const DashboardPage = () => {
    const user = useSelector(selectUser);
    
    // YÊU CẦU MỚI: Kiểm tra session - nếu bị ban sẽ tự động logout
    useSessionCheck();
    
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('All Semesters');
    const [selectedCourse, setSelectedCourse] = useState('All Courses');
    const [sortBy, setSortBy] = useState('course-asc');

    // Fetch payments khi component mount
    useEffect(() => {
        fetchPayments();
    }, []);

    // Filter và sort payments khi có thay đổi
    useEffect(() => {
        filterAndSortPayments();
    }, [payments, searchTerm, selectedSemester, selectedCourse, sortBy]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const data = await api.getPayments();
            setPayments(data);
            setError(null);
        } catch (err) {
            setError('Failed to load payments: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortPayments = () => {
        let filtered = [...payments];

        // Filter by search term (semester or course)
        if (searchTerm) {
            filtered = filtered.filter(payment =>
                payment.semester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by semester
        if (selectedSemester !== 'All Semesters') {
            filtered = filtered.filter(payment => payment.semester === selectedSemester);
        }

        // Filter by course
        if (selectedCourse !== 'All Courses') {
            filtered = filtered.filter(payment => payment.courseName === selectedCourse);
        }

        // Sort
        if (sortBy === 'course-asc') {
            filtered.sort((a, b) => a.courseName.localeCompare(b.courseName));
        } else if (sortBy === 'course-desc') {
            filtered.sort((a, b) => b.courseName.localeCompare(a.courseName));
        } else if (sortBy === 'amount-asc') {
            filtered.sort((a, b) => a.amount - b.amount);
        } else if (sortBy === 'amount-desc') {
            filtered.sort((a, b) => b.amount - a.amount);
        } else if (sortBy === 'date-newest') {
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'date-oldest') {
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        setFilteredPayments(filtered);
    };

    // Get unique semesters and courses for filters
    const uniqueSemesters = ['All Semesters', ...new Set(payments.map(p => p.semester))];
    const uniqueCourses = ['All Courses', ...new Set(payments.map(p => p.courseName))];

    // Format currency VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Calculate statistics
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalPayments = filteredPayments.length;

    return (
        <>
            {/* 1. Header (Navigation Bar) */}
            <NavigationHeader />
            
            {/* 2. Main Dashboard Content */}
            <Container className="py-4">
                {/* Filter Bar */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-light">
                        <h5 className="mb-0">Bộ lọc, Tìm kiếm & Sắp xếp</h5>
                    </Card.Header>
                    <Card.Body>
                        <Row className="g-3">
                            {/* Search */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Tìm kiếm (Semester/Course)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by semester or course name"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            {/* Filter by Semester */}
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Lọc theo Semester</Form.Label>
                                    <Form.Select
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                    >
                                        {uniqueSemesters.map(sem => (
                                            <option key={sem} value={sem}>{sem}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            {/* Filter by Course */}
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Lọc theo Course</Form.Label>
                                    <Form.Select
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                    >
                                        {uniqueCourses.map(course => (
                                            <option key={course} value={course}>{course}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            {/* Sort */}
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Sắp xếp theo:</Form.Label>
                                    <Form.Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="course-asc">Course A-Z</option>
                                        <option value="course-desc">Course Z-A</option>
                                        <option value="amount-asc">Amount Low-High</option>
                                        <option value="amount-desc">Amount High-Low</option>
                                        <option value="date-newest">Date Newest</option>
                                        <option value="date-oldest">Date Oldest</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Dashboard Overview */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">Dashboard Overview</h5>
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2">Loading payments...</p>
                            </div>
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <>
                                {/* Statistics */}
                                <Row className="mb-4">
                                    <Col md={4}>
                                        <Card className="text-center bg-light">
                                            <Card.Body>
                                                <h6 className="text-muted">Total Payments</h6>
                                                <h3 className="text-primary">{totalPayments}</h3>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4}>
                                        <Card className="text-center bg-light">
                                            <Card.Body>
                                                <h6 className="text-muted">Total Amount</h6>
                                                <h3 className="text-success">{formatCurrency(totalAmount)}</h3>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4}>
                                        <Card className="text-center bg-light">
                                            <Card.Body>
                                                <h6 className="text-muted">Logged in as</h6>
                                                <h3 className="text-info">{user?.fullName || user?.username}</h3>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Payments Table */}
                                {filteredPayments.length === 0 ? (
                                    <Alert variant="info">No payments found matching your filters.</Alert>
                                ) : (
                                    <Table striped bordered hover responsive>
                                        <thead className="table-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Semester</th>
                                                <th>Course Name</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPayments.map((payment, index) => (
                                                <tr key={payment.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{payment.semester}</td>
                                                    <td>{payment.courseName}</td>
                                                    <td className="fw-bold text-success">
                                                        {formatCurrency(payment.amount)}
                                                    </td>
                                                    <td>{new Date(payment.date).toLocaleDateString('vi-VN')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>    
        </>
    );
};

export default DashboardPage;

