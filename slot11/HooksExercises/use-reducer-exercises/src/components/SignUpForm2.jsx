import React, { useReducer, useMemo } from 'react';
import { Form, Button, Card, Container, Row, Col, Modal, Toast } from 'react-bootstrap';

// Regex helpers
const isEmail = (v) => /\S+@\S+\.[A-Za-z]{2,}/.test(v);
const isUsername = (v) => /^[A-Za-z0-9._]{3,}$/.test(v.trim());
const isStrongPassword = (v) =>
  /[A-Z]/.test(v) &&        // có chữ hoa
  /[a-z]/.test(v) &&        // có chữ thường
  /\d/.test(v) &&           // có số
  /[^A-Za-z0-9]/.test(v) && // có ký tự đặc biệt
  v.length >= 8;            // độ dài

const initialState = {
  form: { username: '', email: '', password: '', confirm: '' },
  errors: {},
  showModal: false,
  showToast: false,
};

function validate(field, value, form) {
  switch (field) {
    case 'username':
      if (!value.trim()) return 'Username is required';
      if (!isUsername(value)) return '\u2265 3 chars, letters/numbers/._ only, no spaces';
      return '';
    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!isEmail(value)) return 'Invalid email format';
      return '';
    case 'password':
      if (!value) return 'Password is required';
      if (!isStrongPassword(value)) return '\u2265 8 chars, upper, lower, number, special';
      return '';
    case 'confirm':
      if (!value) return 'Please confirm password';
      if (value !== form.password) return 'Passwords do not match';
      return '';
    default:
      return '';
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD': {
      const { name, value } = action.payload;
      const nextForm = { ...state.form, [name]: value };
      const err = validate(name, value, nextForm);
      const nextErrors = { ...state.errors };
      if (err) nextErrors[name] = err; else delete nextErrors[name];
      // Also keep confirm error in sync if password changes
      if (name === 'password' && nextForm.confirm) {
        const confirmErr = validate('confirm', nextForm.confirm, nextForm);
        if (confirmErr) nextErrors.confirm = confirmErr; else delete nextErrors.confirm;
      }
      return { ...state, form: nextForm, errors: nextErrors };
    }
    case 'SUBMIT': {
      const newErrors = {};
      Object.keys(state.form).forEach((field) => {
        const err = validate(field, state.form[field], state.form);
        if (err) newErrors[field] = err;
      });
      if (Object.keys(newErrors).length > 0) {
        return { ...state, errors: newErrors };
      }
      return { ...state, errors: {}, showModal: true, showToast: true };
    }
    case 'CANCEL': {
      return { ...initialState };
    }
    case 'HIDE_TOAST': {
      return { ...state, showToast: false };
    }
    default:
      return state;
  }
}

function SignUpForm2() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { form, errors, showModal, showToast } = state;

  // Memo hóa lỗi toàn form để tính isValid (giống bản useState)
  const formErrors = useMemo(() => {
    const e = {};
    Object.keys(form).forEach((field) => {
      const err = validate(field, form[field], form);
      if (err) e[field] = err;
    });
    return e;
  }, [form]);

  const isValid = Object.keys(formErrors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', payload: { name, value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT' });
  };

  const handleCancel = () => dispatch({ type: 'CANCEL' });

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={7}>
          <Card>
            <Card.Header>
              <h3 className="text-center">Sign Up</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    placeholder="Enter username"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    placeholder="Enter password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="confirm" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    isInvalid={!!errors.confirm}
                    placeholder="Confirm password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirm}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button variant="primary" type="submit" disabled={!isValid} className="w-100">
                    Submit
                  </Button>
                  <Button variant="outline-secondary" type="button" onClick={handleCancel} className="w-100">
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Toast
        show={showToast}
        onClose={() => dispatch({ type: 'HIDE_TOAST' })}
        delay={2000}
        autohide
        style={{ position: 'fixed', top: 20, right: 20, minWidth: 220, zIndex: 9999 }}
      >
        <Toast.Header>
          <strong className="me-auto text-success">Success</strong>
        </Toast.Header>
        <Toast.Body>Submitted successfully!</Toast.Body>
      </Toast>
      <Modal show={showModal} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <p><strong>Username:</strong> {form.username}</p>
              <p><strong>Email:</strong> {form.email}</p>
              <p><strong>Password:</strong> {form.password}</p>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default SignUpForm2;
