// Home.jsx - Trang chủ
import React from 'react';
import { Container } from 'react-bootstrap';

function Home() {
  return (
    <Container className="mt-5">
      <div className="text-center">
        <h1 className="mb-4">🏠 Trang Chủ</h1>
        <p className="lead">
          Chào mừng bạn đến với ứng dụng React Router Demo!
        </p>
        <div className="mt-4 p-4 bg-light rounded">
          <h3>Về Ứng Dụng</h3>
          <p>
            Đây là ứng dụng demo sử dụng React Router v6 để điều hướng giữa các trang.
          </p>
          <ul className="list-unstyled mt-3">
            <li>✅ React Router v6</li>
            <li>✅ Bootstrap styling</li>
            <li>✅ NavLink với active highlighting</li>
            <li>✅ Responsive design</li>
          </ul>
        </div>
      </div>
    </Container>
  );
}

export default Home;
