import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <p className="footer__text">
            © {currentYear} Théo Sury. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
