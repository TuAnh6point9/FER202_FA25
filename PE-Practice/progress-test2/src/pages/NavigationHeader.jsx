// NavigationHeader.jsx là component thanh điều hướng chung chứa thông tin đăng nhập và nút Logout
import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const fullName = user?.fullName || user?.username || 'Student';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand href="/home">TuitionTracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link 
                            onClick={() => navigate('/home')}
                            active={location.pathname === '/home'}
                            className="text-white"
                        >
                            Dashboard
                        </Nav.Link>
                        <Nav.Link 
                            onClick={() => navigate('/payments')}
                            active={location.pathname === '/payments'}
                            className="text-white"
                        >
                            Payment Management
                        </Nav.Link>
                        {/* YÊU CẦU MỚI: Thêm link User Management */}
                        <Nav.Link 
                            onClick={() => navigate('/users')}
                            active={location.pathname === '/users'}
                            className="text-white"
                        >
                            User Management
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        <Navbar.Text className="me-3 text-white">
                            Signed in as: <strong>{fullName}</strong>
                        </Navbar.Text>
                        <Button variant="outline-light" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationHeader;
