import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { allerA } from '../../pages/Home';
import './Header.css';

const SECTIONS = [
  { id: 'films', label: 'Films' },
  { id: 'experiences', label: 'Expériences' },
  { id: 'photos', label: 'Photos' },
  { id: 'contact', label: 'Contact' },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const surAccueil = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu après navigation ; remonter en haut sauf si on vise une section
  useEffect(() => {
    setMenuOpen(false);
    if (!location.state?.section && location.state?.retourY == null) window.scrollTo(0, 0);
  }, [location]);

  // Section visible à l'écran : surlignée dans le menu
  useEffect(() => {
    if (!surAccueil) {
      setActive(location.pathname.startsWith('/films') ? 'films' : null);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    const timer = setTimeout(() => {
      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 500);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [surAccueil, location.pathname]);

  const aller = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (surAccueil) allerA(id);
    else navigate('/', { state: { section: id } });
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link
          to="/"
          className="logo"
          onClick={(e) => { if (surAccueil) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
        >
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

        {/* Navigation : chaque lien descend à sa section de la page unique */}
        <nav className={menuOpen ? 'active' : ''} aria-label="Navigation principale">
          {SECTIONS.map(({ id, label }) => (
            <a key={id} href={`/${id}`} className={active === id ? 'active' : ''} onClick={aller(id)}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
