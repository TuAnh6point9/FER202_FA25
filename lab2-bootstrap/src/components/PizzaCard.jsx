import React from 'react';

function PizzaCard({ title, price, oldPrice, imgSrc, tag }) {
  return (
    <div className="card h-100">
      <div className="position-relative">
        <img src={imgSrc} className="card-img-top" alt={title} />
        {tag && (
          <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2">{tag}</span>
        )}
      </div>
      <div className="card-body text-center d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">
          {oldPrice && <span className="text-decoration-line-through text-muted me-2">${oldPrice}</span>}
          <span className="text-danger fw-bold">${price}</span>
        </p>
        <button className="btn btn-dark mt-auto">Buy</button>
      </div>
    </div>
  );
}

export default PizzaCard;
