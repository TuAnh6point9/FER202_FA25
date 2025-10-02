import React from 'react';

function Hero() {
  return (
    <div className="hero-section position-relative text-white">
      <img 
        src="/images/neapolitan.jpg" 
        className="w-100" 
        alt="Neapolitan Pizza" 
        style={{height:"300px", objectFit:"cover"}} 
      />
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <h2 className="display-6 fw-bold">Neapolitan Pizza</h2>
        <p>If you are looking for traditional Italian pizza, the Neapolitan is the best option!</p>
      </div>
    </div>
  );
}

export default Hero;

