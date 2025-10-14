import React, { useEffect, useState } from 'react';
import { Modal, ListGroup, Badge, Button } from 'react-bootstrap';

export default function FavouritesModal({ show, onHide }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (show) {
      try {
        const fav = JSON.parse(localStorage.getItem('favourites') || '[]');
        setItems(fav);
      } catch {
        setItems([]);
      }
    }
  }, [show]);

  function remove(id){
    const next = items.filter(i=>i.id!==id);
    setItems(next);
    localStorage.setItem('favourites', JSON.stringify(next));
  }

  return (
    <Modal show={show} onHide={onHide} size="md">
      <Modal.Header closeButton>
        <Modal.Title>Favourites</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {items.length === 0 ? (
          <div className="text-muted">No favourite movies yet.</div>
        ) : (
          <ListGroup variant="flush">
            {items.map(m => (
              <ListGroup.Item key={m.id} className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-semibold">{m.title} <Badge bg="secondary">{m.year}</Badge></div>
                  <div className="small text-muted">{m.country} • {m.duration} min</div>
                </div>
                <Button size="sm" variant="outline-danger" onClick={()=>remove(m.id)}>Remove</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
    </Modal>
  );
}
