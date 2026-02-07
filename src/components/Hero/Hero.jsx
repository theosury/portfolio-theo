import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Hero.css';

function Hero() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());

  // Récupère la liste des URLs au montage
  useEffect(() => {
    const imageModules = import.meta.glob('/public/images/hero/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
      eager: true,
      as: 'url'
    });

    const imageUrls = Object.keys(imageModules).map(path => path.replace('/public', ''));
    const shuffled = [...imageUrls].sort(() => Math.random() - 0.5);
    setImages(shuffled);
  }, []);

  // Précharge une image via new Image()
  const preloadImage = useCallback((url) => {
    return new Promise((resolve) => {
      if (!url) return resolve();
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => {
          const next = new Set(prev);
          next.add(url);
          return next;
        });
        resolve();
      };
      img.onerror = () => resolve();
      img.src = url;
    });
  }, []);

  // Charge l'image courante + précharge la suivante
  useEffect(() => {
    if (images.length === 0) return;

    const currentUrl = images[currentIndex];
    const nextIdx = (currentIndex + 1) % images.length;
    const nextUrl = images[nextIdx];

    // Charge l'image courante
    preloadImage(currentUrl).then(() => {
      // Puis précharge la suivante
      preloadImage(nextUrl);
    });
  }, [images, currentIndex, preloadImage]);

  // Change d'image toutes les 7 secondes
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        setPrevIndex(prev);
        return (prev + 1) % images.length;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return null;

  const currentUrl = images[currentIndex];
  const prevUrl = prevIndex !== null ? images[prevIndex] : null;

  return (
    <section id="hero" className="hero">
      <div className="hero-slider">
        {/* Slide précédente (en dessous, visible pendant le fade) */}
        {prevUrl && loadedImages.has(prevUrl) && (
          <div
            className="hero-slide active"
            style={{ backgroundImage: `url(${prevUrl})` }}
          />
        )}
        {/* Slide courante (par-dessus, fade in) */}
        {loadedImages.has(currentUrl) && (
          <div
            key={currentIndex}
            className="hero-slide hero-slide--fade-in"
            style={{ backgroundImage: `url(${currentUrl})` }}
          />
        )}
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
