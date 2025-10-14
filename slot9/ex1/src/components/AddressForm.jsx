import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export default function AddressForm({ data, onChange, errors }) {
  return (
    <Form>
      <Row>
        <Col md={12} className="mb-3">
          <Form.Label><i className="bi bi-geo-alt me-1"></i> Street *</Form.Label>
          <Form.Control type="text" value={data.street || ''} onChange={(e)=>onChange('street', e.target.value)} isInvalid={!!errors.street} />
          <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
        </Col>

        <Col md={6} className="mb-3">
          <Form.Label>City *</Form.Label>
          <Form.Control type="text" value={data.city || ''} onChange={(e)=>onChange('city', e.target.value)} isInvalid={!!errors.city} />
          <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
        </Col>

        <Col md={6} className="mb-3">
          <Form.Label>Zip Code *</Form.Label>
          <Form.Control type="text" value={data.zip || ''} onChange={(e)=>onChange('zip', e.target.value)} isInvalid={!!errors.zip} />
          <Form.Control.Feedback type="invalid">{errors.zip}</Form.Control.Feedback>
        </Col>

        <Col md={6} className="mb-3">
          <Form.Label>Country *</Form.Label>
          <Form.Select value={data.country || ''} onChange={(e)=>onChange('country', e.target.value)} isInvalid={!!errors.country}>
            <option value="">Select a country</option>
            <option>USA</option>
            <option>Vietnam</option>
            <option>UK</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
        </Col>
      </Row>
    </Form>
  );
}
