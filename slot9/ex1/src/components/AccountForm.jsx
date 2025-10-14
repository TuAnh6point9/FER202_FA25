import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

export default function AccountForm({ data, onChange, errors }) {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label><i className="bi bi-person-fill me-1"></i> Username *</Form.Label>
        <InputGroup>
          <InputGroup.Text>@</InputGroup.Text>
          <Form.Control type="text" value={data.username || ''} onChange={(e)=>onChange('username', e.target.value)} isInvalid={!!errors.username} />
          <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label><i className="bi bi-lock-fill me-1"></i> Password *</Form.Label>
        <InputGroup>
          <InputGroup.Text>🔒</InputGroup.Text>
          <Form.Control type="password" value={data.password || ''} onChange={(e)=>onChange('password', e.target.value)} isInvalid={!!errors.password} />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="confirm">
        <Form.Label>Confirm Password *</Form.Label>
        <Form.Control type="password" value={data.confirm || ''} onChange={(e)=>onChange('confirm', e.target.value)} isInvalid={!!errors.confirm} />
        <Form.Control.Feedback type="invalid">{errors.confirm}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="secret">
        <Form.Label>Secret Question *</Form.Label>
        <Form.Select value={data.secret || ''} onChange={(e)=>onChange('secret', e.target.value)} isInvalid={!!errors.secret}>
          <option value="">Select a question</option>
          <option>What is your first pet's name?</option>
          <option>What is your mother's maiden name?</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.secret}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="answer">
        <Form.Label>Answer *</Form.Label>
        <Form.Control type="text" value={data.answer || ''} onChange={(e)=>onChange('answer', e.target.value)} isInvalid={!!errors.answer} />
        <Form.Control.Feedback type="invalid">{errors.answer}</Form.Control.Feedback>
      </Form.Group>
    </Form>
  );
}
