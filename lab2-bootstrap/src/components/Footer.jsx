import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <p className="mb-0">© {new Date().getFullYear()} Pizza House</p>
    </footer>
  );
}

export default Footer;
