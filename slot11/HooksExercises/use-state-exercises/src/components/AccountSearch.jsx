import React, { useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';

// Dữ liệu tĩnh cho accounts
const accounts = [
  { id: 1, username: 'john_doe', password: 'Pass123!', avatar: 'https://via.placeholder.com/150' },
  { id: 2, username: 'jane_smith', password: 'Pass456!', avatar: 'https://via.placeholder.com/150' },
  { id: 3, username: 'bob_jones', password: 'Pass789!', avatar: 'https://via.placeholder.com/150' },
];

function AccountSearch() {
  // State để lưu giá trị tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc danh sách accounts dựa trên searchTerm
  const filteredAccounts = accounts.filter(account =>
    account.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Tìm kiếm Account</h3>
      {/* Ô input tìm kiếm */}
      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Nhập username để tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '500px', margin: '0 auto' }}
        />
      </Form.Group>
      {/* Danh sách accounts */}
      <Row>
        {filteredAccounts.length > 0 ? (
          filteredAccounts.map(account => (
            <Col md={4} key={account.id} className="mb-4">
              <Card>
                <Card.Img variant="top" src={account.avatar} alt={`${account.username}'s avatar`} />
                <Card.Body>
                  <Card.Title>{account.username}</Card.Title>
                  <Card.Text>ID: {account.id}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center">
            <p style={{ color: '#888', fontSize: '18px' }}>Không tìm thấy kết quả</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default AccountSearch;