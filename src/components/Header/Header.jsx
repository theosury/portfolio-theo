import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu après navigation
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0); // Scroll to top sur changement de page
  }, [location]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="logo">
          Théo Sury
        </Link>
        
        {/* Hamburger button */}
        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={menuOpen ? 'active' : ''} aria-label="Navigation principale">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Accueil
          </Link>
          <Link 
            to="/films" 
            className={location.pathname.startsWith('/films') ? 'active' : ''}
          >
            Films
          </Link>
          <Link 
            to="/photos" 
            className={location.pathname === '/photos' ? 'active' : ''}
          >
            Photos
          </Link>
          <Link
            to="/experiences"
            className={location.pathname === '/experiences' ? 'active' : ''}
          >
            Expériences
          </Link>
          <Link
            to="/contact"
            className={location.pathname === '/contact' ? 'active' : ''}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
