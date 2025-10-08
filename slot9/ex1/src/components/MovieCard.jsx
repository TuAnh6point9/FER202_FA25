import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Badge, Toast, Modal } from "react-bootstrap";
import { carouselMovies as movies } from "./data/carousel";

export default function MovieCardGrid() {
  const [favourites, setFavourites] = useState(() => {
    try {
      const raw = localStorage.getItem("favourites");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [toast, setToast] = useState({ show: false, message: "" });
  const [modalMovie, setModalMovie] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("favourites", JSON.stringify(favourites));
    } catch (e) {
      // ignore
    }
  }, [favourites]);

  function addToFavourites(movie) {
    if (!favourites.find((m) => m.id === movie.id)) {
      setFavourites((s) => [movie, ...s]);
      setToast({ show: true, message: "Added to favourites!" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
    } else {
      setToast({ show: true, message: "Already in favourites" });
      setTimeout(() => setToast({ show: false, message: "" }), 1500);
    }
  }

  return (
    <>
      <Row className="g-3">
        {movies.map((m) => (
          <Col key={m.id} xs={12} sm={6} md={4}>
            <Card className="h-100 shadow-sm" style={{ cursor: "default" }}>
              <div style={{ overflow: "hidden", height: 260 }}>
                <Card.Img
                  variant="top"
                  src={m.poster}
                  alt={`${m.title} poster`}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="d-flex justify-content-between align-items-start">
                  <div>
                    {m.title}
                    <div>
                      <Badge bg="info" className="text-dark me-1">
                        {m.genre}
                      </Badge>
                      <Badge bg="secondary">{m.year}</Badge>
                    </div>
                  </div>
                </Card.Title>
                <Card.Text className="flex-grow-1 mt-2" style={{ fontSize: "0.95rem", whiteSpace: 'normal' }}>
                  {m.description}
                </Card.Text>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div style={{ fontSize: "0.9rem" }}>
                    <div>{m.country}</div>
                    <div>{m.duration} phút</div>
                  </div>
                  <div className="d-flex flex-column">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="mb-2"
                      onClick={() => addToFavourites(m)}
                    >
                      Add to Favourites
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setModalMovie(m)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Toast
        onClose={() => setToast({ show: false, message: "" })}
        show={toast.show}
        delay={2000}
        autohide
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1060 }}
      >
        <Toast.Body>{toast.message}</Toast.Body>
      </Toast>

      <Modal show={!!modalMovie} onHide={() => setModalMovie(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalMovie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={modalMovie?.poster}
            alt={`${modalMovie?.title} poster`}
            style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 6 }}
          />
          <p className="mt-3"><strong>Year:</strong> {modalMovie?.year}</p>
          <p><strong>Country:</strong> {modalMovie?.country}</p>
          <p><strong>Duration:</strong> {modalMovie?.duration} phút</p>
          <p><strong>Genre:</strong> <Badge bg="info" className="text-dark">{modalMovie?.genre}</Badge></p>
          <hr />
          <p>{modalMovie?.description}</p>
          <hr />
          <p><strong>Showtimes:</strong> {modalMovie?.showtimes?.join(", ")}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalMovie(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
