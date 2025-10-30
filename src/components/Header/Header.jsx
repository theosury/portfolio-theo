import React, { useState, useEffect } from 'react';
import './Header.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setMenuOpen(false); // Fermer le menu après clic
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 80; // Hauteur du header
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a href="#" className="logo" onClick={(e) => scrollToSection(e, 'hero')}>
          Théo Sury
        </a>
        
        {/* Hamburger button */}
        <button 
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={menuOpen ? 'active' : ''}>
          <a href="#accueil" onClick={(e) => scrollToSection(e, 'hero')}>
            Accueil
          </a>
          <a href="#projets" onClick={(e) => scrollToSection(e, 'hero-projects')}>
            Films
          </a>
          <a href="#photographie" onClick={(e) => scrollToSection(e, 'photographie')}>
            Photos
          </a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;