import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaBirthday } from 'react-icons/fa';

export default function AboutForm({ data, onChange, errors }) {
  return (
    <Form>
      <Row>
        <Col md={6} className="mb-3">
          <Form.Label><i className="bi bi-person-circle me-1"></i> First Name *</Form.Label>
          <Form.Control type="text" value={data.firstName || ''} onChange={(e)=>onChange('firstName', e.target.value)} isInvalid={!!errors.firstName} />
          <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
        </Col>

        <Col md={6} className="mb-3">
          <Form.Label>Last Name *</Form.Label>
          <Form.Control type="text" value={data.lastName || ''} onChange={(e)=>onChange('lastName', e.target.value)} isInvalid={!!errors.lastName} />
          <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-3">
          <Form.Label><i className="bi bi-envelope me-1"></i> Email *</Form.Label>
          <Form.Control type="email" value={data.email || ''} onChange={(e)=>onChange('email', e.target.value)} isInvalid={!!errors.email} />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Col>

        <Col md={3} className="mb-3">
          <Form.Label><i className="bi bi-telephone me-1"></i> Phone *</Form.Label>
          <Form.Control type="text" value={data.phone || ''} onChange={(e)=>onChange('phone', e.target.value)} isInvalid={!!errors.phone} />
+          <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
        </Col>

        <Col md={3} className="mb-3">
          <Form.Label><i className="bi bi-calendar3 me-1"></i> Age *</Form.Label>
          <Form.Control type="number" value={data.age || ''} onChange={(e)=>onChange('age', e.target.value)} isInvalid={!!errors.age} />
          <Form.Control.Feedback type="invalid">{errors.age}</Form.Control.Feedback>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-3">
          <Form.Label><i className="bi bi-person-square me-1"></i> Avatar</Form.Label>
          <Form.Control type="file" onChange={(e)=>onChange('avatar', e.target.files && e.target.files[0])} />
        </Col>
      </Row>
    </Form>
  );
}
