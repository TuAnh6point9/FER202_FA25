// src/pages/HomePage.jsx
import React from "react";
import HomeCarousel from "../components/HomeCarousel";
import MovieCardGrid from "../components/MovieCard";

export default function HomePage() {
  return (
    <div>
      <HomeCarousel />
      {/* Bạn có thể thêm các section tiếp theo của trang Home ở dưới */}
      <div className="mt-4">
        <h4>Featured Movies Collections</h4>
        <p className="text-secondary">Thêm thông tin về các bộ sưu tập phim nổi bật ở đây.</p>
        <MovieCardGrid />
      </div>
    </div>
  );
}

