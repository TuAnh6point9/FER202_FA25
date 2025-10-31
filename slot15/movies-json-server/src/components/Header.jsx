import React from 'react';
import { Navbar, Container, Nav, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar 
      expand="lg" 
      className="mb-4"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
        padding: '1rem 0'
      }}
    >
      <Container>
        <Navbar.Brand 
          href="#home"
          style={{
            color: 'white',
            fontSize: '1.8rem',
            fontWeight: '800',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          🎬 Movie Manager
        </Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          style={{
            borderColor: 'rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.1)'
          }}
        />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {isAuthenticated && user ? (
              <>
                <Navbar.Text 
                  className="me-3"
                  style={{
                    color: 'white',
                    background: 'rgba(255,255,255,0.15)',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '20px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  Xin chào, <strong>{user.username}</strong>{' '}
                  <Badge 
                    bg={user.role === 'admin' ? 'danger' : user.role === 'manager' ? 'warning' : 'info'}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    {user.role}
                  </Badge>
                </Navbar.Text>
                <Button 
                  size="sm" 
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '2px solid white',
                    color: 'white',
                    borderRadius: '20px',
                    padding: '0.5rem 1.5rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.color = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.color = 'white';
                  }}
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                onClick={() => navigate('/login')}
                style={{
                  background: 'white',
                  border: '2px solid white',
                  color: '#667eea',
                  borderRadius: '20px',
                  padding: '0.5rem 1.5rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Đăng nhập
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
