import React, { useState, useEffect } from 'react';
import './Hero.css';

function Hero() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Charge et mélange les images une seule fois au montage
  useEffect(() => {
    const imageModules = import.meta.glob('/public/images/hero/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { 
      eager: true,
      as: 'url'
    });

    const imageUrls = Object.keys(imageModules).map(path => path.replace('/public', ''));

    // Mélange aléatoirement les images (ordre fixe pour la session)
    const shuffled = [...imageUrls].sort(() => Math.random() - 0.5);

    setImages(shuffled);
  }, []);

  // Change d'image toutes les 7 secondes
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <section id="hero" className="hero">
      <div className="hero-slider">
        {images.map((img, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>
      
      <div className="hero-content">
        <h1 className="hero-title">Théo Sury</h1>
        <p className="hero-subtitle">CHEF-OPÉRATEUR & ÉLECTRICIEN</p>
      </div>
      
      <button
        className="hero-cta"
        onClick={() => {
          const section = document.getElementById('hero-projects');
          if (section) {
            const offset = 80;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }}
      >
        <span className="hero-arrow">↓</span>
      </button>
    </section>
  );
}

export default Hero;
