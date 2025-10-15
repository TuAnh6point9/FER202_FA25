import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';

// Component RegisterForm
function RegisterForm() {
  // State cho form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  // Regex cho validate
  const usernameRegex = /^[a-zA-Z0-9_.]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate từng trường
    const newErrors = { ...errors };
    if (name === 'username') {
      if (!usernameRegex.test(value) || value.trim() === '') {
        newErrors.username = 'Username phải ≥ 3 ký tự, chỉ chứa chữ, số, _ hoặc .';
      } else {
        delete newErrors.username;
      }
    }
    if (name === 'email') {
      if (!emailRegex.test(value)) {
        newErrors.email = 'Email không đúng định dạng';
      } else {
        delete newErrors.email;
      }
    }
    if (name === 'password') {
      if (!passwordRegex.test(value)) {
        newErrors.password =
          'Password phải ≥ 8 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt';
      } else {
        delete newErrors.password;
      }
      // Kiểm tra confirm password khi password thay đổi
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirm password không khớp';
      } else {
        delete newErrors.confirmPassword;
      }
    }
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        newErrors.confirmPassword = 'Confirm password không khớp';
      } else {
        delete newErrors.confirmPassword;
      }
    }
    setErrors(newErrors);
  };

  // Kiểm tra form hợp lệ
  const isFormValid = () => {
    return (
      usernameRegex.test(formData.username) &&
      emailRegex.test(formData.email) &&
      passwordRegex.test(formData.password) &&
      formData.password === formData.confirmPassword &&
      Object.keys(errors).length === 0
    );
  };

  // Xử lý submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!usernameRegex.test(formData.username)) {
      newErrors.username = 'Username phải ≥ 3 ký tự, chỉ chứa chữ, số, _ hoặc .';
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password phải ≥ 8 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password không khớp';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setShowToast(true);
    }
  };

  // Xử lý reset
  const handleReset = () => {
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setShowToast(false);
  };

  // Đóng Modal
  const handleCloseToast = () => {
    setShowToast(false);
    handleReset();
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '600px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <Row className="justify-content-md-center">
        <Col>
          <Card style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ background: '#fff', borderBottom: 'none', textAlign: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000' }}>Create your account</h3>
            </Card.Header>
            <Card.Body style={{ padding: '20px 40px' }}>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label style={{ fontSize: '14px', color: '#333' }}>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    placeholder="Enter username"
                    style={{ fontSize: '14px', borderRadius: '8px', padding: '12px' }}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: '12px' }}>
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label style={{ fontSize: '14px', color: '#333' }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter email"
                    style={{ fontSize: '14px', borderRadius: '8px', padding: '12px' }}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: '12px' }}>
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                  <Form.Label style={{ fontSize: '14px', color: '#333' }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    placeholder="Enter password"
                    style={{ fontSize: '14px', borderRadius: '8px', padding: '12px' }}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: '12px' }}>
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mb-3">
                  <Form.Label style={{ fontSize: '14px', color: '#333' }}>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                    placeholder="Confirm password"
                    style={{ fontSize: '14px', borderRadius: '8px', padding: '12px' }}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: '12px' }}>
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-2"
                  disabled={!isFormValid()}
                  style={{
                    background: '#1DA1F2',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={handleReset}
                  style={{
                    borderRadius: '25px',
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#1DA1F2',
                    borderColor: '#1DA1F2',
                  }}
                >
                  Cancel
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal hiển thị khi submit thành công */}
      <Modal show={showToast} onHide={handleCloseToast} centered>
        <Modal.Header closeButton style={{ border: 'none' }}>
          <Modal.Title style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Submitted Successfully!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card style={{ borderRadius: '10px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Card.Body>
              <p style={{ fontSize: '16px', margin: '0' }}>
                <strong>Username:</strong> {formData.username}
              </p>
              <p style={{ fontSize: '16px', margin: '0' }}>
                <strong>Email:</strong> {formData.email}
              </p>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer style={{ border: 'none' }}>
          <Button
            variant="success"
            onClick={handleCloseToast}
            style={{
              borderRadius: '20px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default RegisterForm;