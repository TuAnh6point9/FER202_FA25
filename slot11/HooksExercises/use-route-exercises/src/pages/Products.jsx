// Products.jsx - Trang sản phẩm
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function Products() {
  const products = [
    { id: 1, name: 'Laptop Dell XPS 13', price: '25,000,000 VNĐ', image: '💻' },
    { id: 2, name: 'iPhone 15 Pro', price: '30,000,000 VNĐ', image: '📱' },
    { id: 3, name: 'AirPods Pro', price: '6,000,000 VNĐ', image: '🎧' },
    { id: 4, name: 'iPad Air', price: '15,000,000 VNĐ', image: '📲' },
    { id: 5, name: 'Apple Watch', price: '10,000,000 VNĐ', image: '⌚' },
    { id: 6, name: 'MacBook Pro', price: '45,000,000 VNĐ', image: '💻' }
  ];

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">🛍️ Sản Phẩm</h1>
      <p className="text-center text-muted mb-5">
        Khám phá các sản phẩm công nghệ hàng đầu
      </p>
      
      <Row>
        {products.map(product => (
          <Col key={product.id} xs={12} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div style={{ fontSize: '64px' }} className="mb-3">
                  {product.image}
                </div>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text className="text-primary fw-bold">
                  {product.price}
                </Card.Text>
                <button className="btn btn-primary btn-sm">
                  Xem chi tiết
                </button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Products;
