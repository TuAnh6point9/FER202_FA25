import React from 'react';
import { Navbar, Nav, Container, Form, Button, Dropdown } from 'react-bootstrap';
import { FaUserCircle, FaSignInAlt, FaSignOutAlt, FaHeart } from 'react-icons/fa';

export default function NavBar({ onQuickSearch, isLoggedIn=false, onLogin, onLogout, onShowFavourites }) {
  return (
  <Navbar bg="dark" expand="lg" className="mb-3 app-navbar" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#">MyMovies</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">About</Nav.Link>
            <Nav.Link href="#">Contact</Nav.Link>
          </Nav>

          <Form className="d-flex me-3" role="search" onSubmit={(e) => { e.preventDefault(); const val = e.target.querySelector('input')?.value; if(onQuickSearch) onQuickSearch(val); }}>
            <Form.Control name="quickSearch" type="search" placeholder="Quick search" className="me-2" aria-label="Search" />
            <Button variant="outline-primary" onClick={() => { const val = document.querySelector('input[name="quickSearch"]')?.value; if(onQuickSearch) onQuickSearch(val); }}>Search</Button>
          </Form>

          {isLoggedIn && (
            <Dropdown className="me-2">
              <Dropdown.Toggle variant="light" id="dropdown-account">
                <FaUserCircle size={20} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Manage Your Profiles</Dropdown.Item>
                <Dropdown.Item>Build your Account</Dropdown.Item>
                <Dropdown.Item>Change Password</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}

          {!isLoggedIn ? (
            <Button variant="outline-secondary" className="me-2" onClick={onLogin}><FaSignInAlt /></Button>
          ) : (
            <Button variant="outline-secondary" className="me-2" onClick={onLogout}><FaSignOutAlt /></Button>
          )}
          <Button variant="outline-danger" onClick={onShowFavourites}><FaHeart /></Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
