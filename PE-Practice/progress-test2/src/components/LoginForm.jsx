import React, { useReducer } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, selectAuth } from '../redux/slices/authSlice';
import ConfirmModal from './ConfirmModal';
import { useNavigate } from 'react-router-dom';

// 1. Khởi tạo trạng thái ban đầu cho form

const initialFormState = {
  formData: {
    identifier: '', // username hoặc email
    password: '',
  },
  errors: {},
  showSuccessModal: false,
};

// 2. Định nghĩa reducer cho form 
function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      // Cập nhật giá trị vào state.formData
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
      };
    case 'SET_ERROR':
      // Cập nhật lỗi cho trường cụ thể
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message },
      };
    case 'CLEAR_ERROR':
        // Sửa lỗi: Xóa lỗi cho trường cụ thể
      const { [action.field]: removed, ...restErrors } = state.errors;
      return {
        ...state,
        errors: restErrors,
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };
    case 'SHOW_SUCCESS_MODAL':
      return {
        ...state,
        showSuccessModal: true,
      };
    case 'HIDE_SUCCESS_MODAL':
      return {
        ...state,
        showSuccessModal: false,
      };
    case 'RESET_FORM':
      return initialFormState;
    default:
      return state;
  }
}

function LoginForm() {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  // 3. Sử dụng useReducer cho form state
  const [formState, dispatch] = useReducer(formReducer, initialFormState);

  // 4. Lấy auth state từ Redux store
  const { isLoading, error, user } = useSelector(selectAuth);

  // 5. Validation helpers
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmail = (v) => v.includes('@');

  // 6. Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cập nhật giá trị field (SỬ DỤNG action SET_FIELD đã sửa)
    dispatch({ type: 'SET_FIELD', field: name, value });

    // Clear auth error khi user nhập
    if (error) reduxDispatch(clearError());

    // Validation real-time
    let message = '';
    if (name === 'identifier') {
      if (!value.trim()) {
        message = 'Username or Email is required.';
      } else if (isEmail(value) && !emailRe.test(value)) {
        message = 'Email is invalid format.';
      }
    }

    if (name === 'password') {
      if (!value.trim()) {
        message = 'Password is required.';
      } else if (value.length < 6) { // Thêm validation min length 6
        message = 'Password must be at least 6 characters.';
      }
    }

    if (message) {
      dispatch({ type: 'SET_ERROR', field: name, message });
    } else {
      dispatch({ type: 'CLEAR_ERROR', field: name });
    }
  };

  // 7. Validation form
  const validateForm = () => {
    const errors = {};
    const { identifier, password } = formState.formData; // Lấy từ formData đã sửa

    if (!identifier.trim()) {
      errors.identifier = 'Username or Email is required.';
    } else if (isEmail(identifier) && !emailRe.test(identifier)) {
      errors.identifier = 'Email is invalid format.';
    }

    if (!password.trim()) {
     errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    return errors;
  };

  // 8. Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) reduxDispatch(clearError());

    // Validate form
    const validationErrors = validateForm();
    dispatch({ type: 'SET_ERRORS', errors: validationErrors });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      // Dispatch loginUser async thunk
      const result = await reduxDispatch(loginUser({
        usernameOrEmail: formState.formData.identifier.trim(), 
        password: formState.formData.password,
      })).unwrap(); // unwrap() để lấy kết quả hoặc throw error

      // Nếu thành công, hiển thị modal
      dispatch({ type: 'SHOW_SUCCESS_MODAL' });
    } catch (err) {
      // Lỗi đã được xử lý trong authSlice và lưu vào state.error
      console.error('Login error:', err);
    }
  };
  //9. Xử lý reset form
    const handleReset = () => { 
    //1. Reset form state về ban đầu
    dispatch({ type: 'RESET_FORM' });
    //2. Xóa lỗi từ Redux store nếu có
    if (error) reduxDispatch(clearError());
  };

  // 10. Xử lý đóng modal thành công
  const handleCloseSuccessModal = () => {
    dispatch({ type: 'HIDE_SUCCESS_MODAL' });
    dispatch({ type: 'RESET_FORM' });
    // Chuyển hướng đến /home sau khi đóng modal[cite: 17]
    navigate('/home'); 
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card>
            <Card.Header>
              <h3 className="text-center mb-0">Login</h3>
            </Card.Header>
            <Card.Body>
              {/* Hiển thị lỗi từ Redux store */}
              {error && (
                <Alert variant="danger" className="mb-3" onClose={() => reduxDispatch(clearError())} dismissible>
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit} noValidate>
                {/* Identifier Field */}
                <Form.Group controlId="identifier" className="mb-3">
                  <Form.Label>Username or Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="identifier"
                    value={formState.formData.identifier} // Lấy từ formData
                    onChange={handleChange}
                    isInvalid={!!formState.errors.identifier}
                    placeholder="Enter username or email"
                    disabled={isLoading}
                  />
                  {/* Form.Control.Feedback: Hiển thị lỗi validation */}
                  <Form.Control.Feedback type="invalid">
                    {formState.errors.identifier}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password Field */}
                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formState.formData.password} // Lấy từ formData
                    onChange={handleChange}
                    isInvalid={!!formState.errors.password}
                    placeholder="Enter password"
                    disabled={isLoading}
                  />
                  {/* Form.Control.Feedback: Hiển thị lỗi validation */}
                  <Form.Control.Feedback type="invalid">
                    {formState.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    style={{ flex: 1 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" animation="border" role="status" className="me-2" />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                  <Button 
                    variant="secondary" 
                    type="button" 
                    style={{ flex: 1 }}
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
                
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal thông báo thành công, gọi ConfirmModal */}
      <ConfirmModal
        show={formState.showSuccessModal}
        title="Login Successful!"
        message={`Welcome, ${user?.username}!, login successful.`}
        onConfirm={handleCloseSuccessModal}
        onHide={handleCloseSuccessModal}
      />
    </Container>
  );
}

export default LoginForm;
