// Navbar.jsx - Thanh điều hướng với NavLink
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Navbar.css';

function NavigationBar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">
          <strong>🚀 React Router Demo</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? 'nav-link active-link' : 'nav-link'
              }
            >
              🏠 Trang Chủ
            </NavLink>
            <NavLink 
              to="/san-pham" 
              className={({ isActive }) => 
                isActive ? 'nav-link active-link' : 'nav-link'
              }
            >
              🛍️ Sản Phẩm
            </NavLink>
            <NavLink 
              to="/lien-he" 
              className={({ isActive }) => 
                isActive ? 'nav-link active-link' : 'nav-link'
              }
            >
              📞 Liên Hệ
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
