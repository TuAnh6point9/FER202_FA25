// Contact.jsx - Trang liên hệ
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset form sau 3 giây
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">📞 Liên Hệ</h1>
      <p className="text-center text-muted mb-5">
        Chúng tôi luôn sẵn sàng lắng nghe bạn
      </p>

      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h4 className="mb-4">Gửi tin nhắn cho chúng tôi</h4>
              
              {submitted && (
                <Alert variant="success">
                  ✅ Cảm ơn bạn! Tin nhắn đã được gửi thành công.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ tên của bạn"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nội dung</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung tin nhắn..."
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Gửi tin nhắn
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h4 className="mb-4">Thông tin liên hệ</h4>
              
              <div className="mb-4">
                <h5>📍 Địa chỉ</h5>
                <p className="text-muted">
                  Lô E2a-7, Đường D1, Khu Công nghệ cao,<br />
                  Tp. Thủ Đức, Tp. Hồ Chí Minh
                </p>
              </div>

              <div className="mb-4">
                <h5>📧 Email</h5>
                <p className="text-muted">
                  support@example.com<br />
                  contact@example.com
                </p>
              </div>

              <div className="mb-4">
                <h5>📱 Điện thoại</h5>
                <p className="text-muted">
                  Hotline: 1900-xxxx<br />
                  Mobile: 0912-xxx-xxx
                </p>
              </div>

              <div>
                <h5>🕐 Giờ làm việc</h5>
                <p className="text-muted">
                  Thứ 2 - Thứ 6: 8:00 - 17:30<br />
                  Thứ 7: 8:00 - 12:00<br />
                  Chủ nhật: Nghỉ
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Contact;
