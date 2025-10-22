// LoginForm2: useReducer version of LoginForm with same UI/behavior
import React, { useReducer } from 'react';
import { Form, Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';

const initialState = {
  username: '',
  password: '',
  errors: {},
  showModal: false,
};

function validateField(field, value) {
  if (field === 'username') {
    if (!value.trim()) return 'Username is required';
    return '';
  }
  if (field === 'password') {
    if (!value.trim()) return 'Password is required';
    return '';
  }
  return '';
}

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD': {
      const { field, value } = action.payload;
      const err = validateField(field, value);
      const nextErrors = { ...state.errors };
      if (err) nextErrors[field] = err; else delete nextErrors[field];
      return { ...state, [field]: value, errors: nextErrors };
    }
    case 'SUBMIT': {
      const newErrors = {};
      const uErr = validateField('username', state.username);
      const pErr = validateField('password', state.password);
      if (uErr) newErrors.username = uErr;
      if (pErr) newErrors.password = pErr;
      if (Object.keys(newErrors).length > 0) {
        return { ...state, errors: newErrors };
      }
      return { ...state, errors: {}, showModal: true };
    }
    case 'CLOSE_MODAL': {
      return { ...initialState };
    }
    case 'RESET': {
      return { ...initialState };
    }
    default:
      return state;
  }
}

function LoginForm2({ onSubmit }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { username, password, errors, showModal } = state;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT' });
    if (onSubmit && username.trim() && password.trim()) {
      onSubmit({ username, password });
    }
  };

  const handleCloseModal = () => dispatch({ type: 'CLOSE_MODAL' });

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h3 className="text-center">Login</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'username', value: e.target.value } })}
                    isInvalid={!!errors.username}
                    placeholder="Enter username"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'password', value: e.target.value } })}
                    isInvalid={!!errors.password}
                    placeholder="Enter password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Welcome, {username}!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default LoginForm2;
