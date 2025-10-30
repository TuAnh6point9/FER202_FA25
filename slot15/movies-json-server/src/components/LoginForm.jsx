import React, { useReducer, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// 1. Khởi tạo trạng thái ban đầu cho form
const initialFormState = {
  identifier: '', // username hoặc email
  password: '',
  errors: {}
};

// 2. Định nghĩa reducer cho form
function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message }
      };
    case 'CLEAR_ERROR':
      const { [action.field]: removed, ...restErrors } = state.errors;
      return {
        ...state,
        errors: restErrors
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors
      };
    case 'RESET_FORM':
      return initialFormState;
    default:
      return state;
  }
}

function LoginForm() {
  // 3. Sử dụng useReducer cho form state
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  
  // 4. Sử dụng AuthContext và React Router
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 5. Redirect nếu đã authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/movies');
    }
  }, [isAuthenticated, navigate]);

  // 6. Validation helpers
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmail = (v) => v.includes('@');

  // 7. Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Cập nhật giá trị field
    dispatch({ type: 'SET_FIELD', field: name, value });
    
    // Clear auth error khi user nhập
    clearError();

    // Validation real-time
    if (name === 'identifier') {
      if (!value.trim()) {
        dispatch({ type: 'SET_ERROR', field: name, message: 'Username or Email is required.' });
      } else if (isEmail(value) && !emailRe.test(value)) {
        dispatch({ type: 'SET_ERROR', field: name, message: 'Email is invalid format.' });
      } else {
        dispatch({ type: 'CLEAR_ERROR', field: name });
      }
    }

    if (name === 'password') {
      if (!value.trim()) {
        dispatch({ type: 'SET_ERROR', field: name, message: 'Password is required.' });
      } else {
        dispatch({ type: 'CLEAR_ERROR', field: name });
      }
    }
  };

  // 8. Validation form
  const validateForm = () => {
    const errors = {};
    
    if (!formState.identifier.trim()) {
      errors.identifier = 'Username or Email is required.';
    } else if (isEmail(formState.identifier) && !emailRe.test(formState.identifier)) {
      errors.identifier = 'Email is invalid format.';
    }
    
    if (!formState.password.trim()) {
      errors.password = 'Password is required.';
    }
    
    return errors;
  };

  // 9. Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    // Validate form
    const validationErrors = validateForm();
    dispatch({ type: 'SET_ERRORS', errors: validationErrors });
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      // Gọi login từ AuthContext
      const result = await login(formState.identifier.trim(), formState.password);
      
      if (result.ok) {
        // Chuyển hướng đến trang movies (được xử lý bởi useEffect)
        console.log('Login successful, redirecting...');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // 10. Xử lý reset form
  const handleReset = () => {
    dispatch({ type: 'RESET_FORM' });
    clearError();
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white text-center">
              <h4>🎬 Movie Manager Login</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {/* Hiển thị lỗi từ AuthContext */}
              {error && (
                <Alert variant="danger" dismissible onClose={clearError}>
                  <Alert.Heading>Login Failed</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Username/Email Field */}
                <Form.Group className="mb-3">
                  <Form.Label>Username or Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="identifier"
                    placeholder="Enter username or email"
                    value={formState.identifier}
                    onChange={handleChange}
                    isInvalid={!!formState.errors.identifier}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formState.errors.identifier}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-3">
                  <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formState.password}
                    onChange={handleChange}
                    isInvalid={!!formState.errors.password}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formState.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Buttons */}
                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="flex-grow-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                  <Button 
                    variant="secondary" 
                    type="button" 
                    onClick={handleReset}
                    disabled={loading}
                  >
                    Reset
                  </Button>
                </div>
              </Form>
            </Card.Body>
            <Card.Footer className="text-muted text-center">
              <small><strong>Test Accounts:</strong></small><br />
              <small>
                Admin: admin / 123456<br />
                Manager: manager / 123456<br />
                User: user1 / 123456
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;
