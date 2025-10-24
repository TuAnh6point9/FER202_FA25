import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import các component pages
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';

// Import component Navbar
import NavigationBar from './components/Navbar';

function App() {
  return (
    <>
      {/* Thanh điều hướng hiển thị ở mọi trang */}
      <NavigationBar />
      
      {/* Định nghĩa các Routes */}
      <Routes>
        {/* Route 1: Trang chủ - URL: / */}
        <Route path="/" element={<Home />} />
        
        {/* Route 2: Trang sản phẩm - URL: /san-pham */}
        <Route path="/san-pham" element={<Products />} />
        
        {/* Route 3: Trang liên hệ - URL: /lien-he */}
        <Route path="/lien-he" element={<Contact />} />
        
        {/* Route 404: Trang không tìm thấy (optional) */}
        <Route path="*" element={
          <div className="container mt-5 text-center">
            <h1>404 - Không tìm thấy trang</h1>
            <p>Trang bạn đang tìm kiếm không tồn tại.</p>
          </div>
        } />
      </Routes>
    </>
  );
}

export default App;

