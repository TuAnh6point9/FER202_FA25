import React from 'react';
import Hero from '../components/Hero.jsx';
import PizzaCard from '../components/PizzaCard.jsx';
import BookingForm from '../components/BookingForm.jsx';

const pizzas = [
  { id: 1, title: 'Margherita Pizza', price: '24.00', oldPrice: '40.00', imgSrc: '/images/margherita.jpg', tag: 'SALE' },
  { id: 2, title: 'Mushroom Pizza', price: '25.00', imgSrc: '/images/mushroom.jpg' },
  { id: 3, title: 'Hawaiian Pizza', price: '30.00', imgSrc: '/images/hawaiian.jpg', tag: 'NEW' },
  { id: 4, title: 'Pesto Pizza', price: '16.00', oldPrice: '50.00', imgSrc: '/images/pesto.jpg', tag: 'SALE' },
  { id: 5, title: 'Neapolitan Pizza', price: '35.00', imgSrc: '/images/neapolitan.jpg' },
];

function Menu() {
  return (
    <>
      <Hero />
      <div className="container my-5">
        <h3 className="mb-4 text-white">Our Menu</h3>
        <div className="row g-4">
          {pizzas.map(p => (
            <div key={p.id} className="col-12 col-sm-6 col-md-3">
              <PizzaCard {...p} />
            </div>
          ))}
        </div>
      </div>
      <BookingForm />
    </>
  );
}

export default Menu;
