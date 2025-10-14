import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Button, Toast, Badge } from 'react-bootstrap';
import MovieCard from './MovieCard';
import { movies as allMovies } from './data/movies.js';

export default function MovieCardGrid({ search = '', yearRange = 'all', sortBy = 'none' }) {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('favourites');
    if (saved) {
      setFavourites(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  function handleDetails(movie) {
    setSelected(movie);
    setShowModal(true);
  }

  function handleAddFavourite(movie) {
    if (!favourites.find((m) => m.id === movie.id)) {
      const next = [...favourites, movie];
      setFavourites(next);
      setToastMsg('Added to favourites!');
      setShowToast(true);
    } else {
      setToastMsg('Already in favourites');
      setShowToast(true);
    }
  }

  return (
    <div>
      {/* tighter gutter g-2 makes cards closer; wrapper adjusts small negative margin to visually tighten columns */}
      <div className="movie-grid-wrapper" style={{ marginLeft: '-6px', marginRight: '-6px' }}>
        <Row xs={1} sm={2} md={3} className="g-2">
        {(() => {
          let list = allMovies.slice();
          const q = (search || '').toLowerCase().trim();
          if (q) {
            list = list.filter(m => (m.title + ' ' + m.description + ' ' + (m.genre || '')).toLowerCase().includes(q));
          }
          if (yearRange === 'lte2000') list = list.filter(m => m.year <= 2000);
          if (yearRange === '2001-2015') list = list.filter(m => m.year >= 2001 && m.year <= 2015);
          if (yearRange === 'gt2015') list = list.filter(m => m.year > 2015);

          if (sortBy === 'year-asc') list.sort((a,b) => a.year - b.year);
          if (sortBy === 'year-desc') list.sort((a,b) => b.year - a.year);
          if (sortBy === 'title-asc') list.sort((a,b) => a.title.localeCompare(b.title));
          if (sortBy === 'title-desc') list.sort((a,b) => b.title.localeCompare(a.title));
          if (sortBy === 'duration-asc') list.sort((a,b) => a.duration - b.duration);
          if (sortBy === 'duration-desc') list.sort((a,b) => b.duration - a.duration);

          return list.map((m) => (
            <Col key={m.id} className="px-2">
              <div className="h-100">
                <MovieCard
                  img={m.poster}
                  title={m.title}
                  text={m.description}
                  genre={m.genre}
                  year={m.year}
                  country={m.country}
                  duration={m.duration}
                  alt={`Poster of ${m.title}`}
                  onDetails={() => handleDetails(m)}
                  onAddFavourite={() => handleAddFavourite(m)}
                />
              </div>
            </Col>
          ));
        })()}
        </Row>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selected?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <div>
              <img
                src={selected.poster}
                alt={`Poster of ${selected.title}`}
                style={{ width: '100%', maxHeight: 360, objectFit: 'cover' }}
              />
              <div className="mt-3">
                <h5>
                  <Badge bg="info" className="text-dark">{selected.genre}</Badge>{' '}
                  <Badge bg="secondary">{selected.year}</Badge>
                </h5>
                <p className="text-muted mb-1">{selected.country} • {selected.duration} min</p>
                <p>{selected.description}</p>
                <p className="text-muted">Showtimes: (placeholder) 10:00 • 13:30 • 19:00</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={2000}
        autohide
        style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 2000 }}
      >
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>{toastMsg}</Toast.Body>
      </Toast>
    </div>
  );
}
