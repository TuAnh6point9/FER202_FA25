import React from 'react';
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      {/* NavLink tự động thêm class 'active' nếu đường dẫn khớp */}
      <NavLink 
        to="/" 
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        Trang Chủ
      </NavLink>
      <NavLink 
        to="/about"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        Giới Thiệu
      </NavLink>
      <NavLink 
        to="/users/123"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        User 123
      </NavLink>
    </nav>
  );
}

export default Navigation;
