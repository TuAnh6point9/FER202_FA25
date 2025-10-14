import React, { useState } from 'react';
import { Modal, ProgressBar, Nav, Tab, Button } from 'react-bootstrap';
import AboutForm from './AboutForm';
import AccountForm from './AccountForm';
import AddressForm from './AddressForm';

export default function ProfileWizard({ show=true, onClose, onFinish }) {
  const [key, setKey] = useState('about');
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setData(prev => ({ ...prev, [field]: value }));
  }

  function validateStep(step) {
    const e = {};
    if (step === 'about') {
      if (!data.firstName) e.firstName = 'First name is required';
      if (!data.lastName) e.lastName = 'Last name is required';
      if (!data.email) e.email = 'Email is required';
      if (!data.phone) e.phone = 'Phone is required';
      if (!data.age) e.age = 'Age is required';
    }
    if (step === 'account') {
      if (!data.username) e.username = 'Username is required';
      if (!data.password) e.password = 'Password is required';
      if (!data.confirm) e.confirm = 'Confirm password is required';
      if (data.password && data.confirm && data.password !== data.confirm) e.confirm = 'Passwords do not match';
      if (!data.secret) e.secret = 'Secret question is required';
      if (!data.answer) e.answer = 'Answer is required';
    }
    if (step === 'address') {
      if (!data.street) e.street = 'Street is required';
      if (!data.city) e.city = 'City is required';
      if (!data.zip) e.zip = 'Zip code is required';
      if (!data.country) e.country = 'Country is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (key === 'about') {
      if (!validateStep('about')) return;
      setKey('account');
    } else if (key === 'account') {
      if (!validateStep('account')) return;
      setKey('address');
    }
  }

  function previous() {
    if (key === 'address') setKey('account');
    else if (key === 'account') setKey('about');
  }

  function finish() {
    if (!validateStep('address')) return;
    if (onFinish) onFinish(data);
    else if (onClose) onClose();
  }

  const progress = key === 'about' ? 33 : key === 'account' ? 67 : 100;

  return (
  <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Build Your Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar now={progress} className="mb-3" />

        <Tab.Container activeKey={key} onSelect={(k)=>setKey(k)}>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="about"><i className="bi bi-person-circle me-1"></i> About</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="account"><i className="bi bi-lock me-1"></i> Account</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="address"><i className="bi bi-geo-alt me-1"></i> Address</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="mt-3">
            <Tab.Pane eventKey="about">
              <h4><i className="bi bi-person-circle me-2"></i>About Information</h4>
              <AboutForm data={data} onChange={update} errors={errors} />
            </Tab.Pane>

            <Tab.Pane eventKey="account">
              <h4><i className="bi bi-lock me-2"></i>Account Information</h4>
              <AccountForm data={data} onChange={update} errors={errors} />
            </Tab.Pane>

            <Tab.Pane eventKey="address">
              <h4><i className="bi bi-geo-alt me-2"></i>Address Information</h4>
              <AddressForm data={data} onChange={update} errors={errors} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <div className="w-100 d-flex justify-content-between">
          <div>
            <Button variant="secondary" onClick={previous} disabled={key === 'about'}>Previous</Button>
          </div>
          <div>
            {key !== 'address' ? (
              <Button variant="primary" onClick={next}>Next</Button>
            ) : (
              <Button variant="success" onClick={finish}>Finish</Button>
            )}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
