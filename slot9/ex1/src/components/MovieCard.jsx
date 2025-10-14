import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import "./MovieCard.css";

export default function MovieCard({ img, title, text, genre, year, country, duration, alt, onDetails, onAddFavourite }) {
  return (
    <Card className="movie-card h-100">
      <div className="movie-card-img-wrap">
        <Card.Img className="movie-card-img" variant="top" src={img} alt={alt || title} />
        {genre && <span className="movie-genre-badge">{genre}</span>}
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="movie-card-title">{title} <small className="text-muted">({year})</small></Card.Title>

        <div className="movie-card-meta text-muted mb-2">
          <small>{country} • {duration} min</small>
        </div>

        <Card.Text className="movie-card-text">
          {text}
        </Card.Text>

        <div className="movie-card-actions mt-auto d-flex justify-content-between">
          <Button variant="primary" size="sm" onClick={onDetails}>View Details</Button>
          <Button variant="outline-warning" size="sm" onClick={onAddFavourite}>Add to Favourites</Button>
        </div>
      </Card.Body>
    </Card>
  );
}
