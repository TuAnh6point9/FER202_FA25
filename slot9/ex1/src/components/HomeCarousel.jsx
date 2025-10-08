import React from 'react';

function HomeCarousel() {
  // Dữ liệu mẫu cho 3 phim nổi bật
  const featuredMovies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      genre: "Action",
      image: "https://via.placeholder.com/800x400/FF5733/FFFFFF?text=Avengers+Endgame",
      description: "Cuộc chiến cuối cùng của các siêu anh hùng"
    },
    {
      id: 2,
      title: "Inception",
      genre: "Sci-Fi",
      image: "https://via.placeholder.com/800x400/33C3FF/FFFFFF?text=Inception",
      description: "Thế giới của những giấc mơ và thực tại"
    },
    {
      id: 3,
      title: "The Dark Knight",
      genre: "Crime",
      image: "https://via.placeholder.com/800x400/8E44AD/FFFFFF?text=The+Dark+Knight",
      description: "Batman đối đầu với Joker trong Gotham City"
    }
  ];

  return (
    <div id="movieCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
      {/* Indicators */}
      <div className="carousel-indicators">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#movieCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Carousel Inner */}
      <div className="carousel-inner">
        {featuredMovies.map((movie, index) => (
          <div key={movie.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <img
              src={movie.image}
              className="d-block w-100"
              alt={movie.title}
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h5 className="fw-bold text-white">{movie.title}</h5>
              <p className="mb-2">{movie.description}</p>
              <span className="badge bg-primary fs-6 px-3 py-2">{movie.genre}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#movieCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#movieCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default HomeCarousel;