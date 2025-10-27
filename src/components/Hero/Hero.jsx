import React, { useState, useEffect } from 'react';
import { heroImages } from '../../data/projectsData';
import './Hero.css';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-slide toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentImageIndex((prev) => 
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
      setIsTransitioning(false);
    }, 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentImageIndex((prev) => 
        prev === 0 ? heroImages.length - 1 : prev - 1
      );
      setIsTransitioning(false);
    }, 500);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <section className="hero" id="hero">
      {/* Slider d'images */}
      <div className="hero__slider">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`hero__slide ${
              index === currentImageIndex ? 'hero__slide--active' : ''
            } ${isTransitioning ? 'hero__slide--transitioning' : ''}`}
            style={{ backgroundImage: `url(${image.src})` }}
          >
            <div className="hero__overlay"></div>
          </div>
        ))}
      </div>

      {/* Contenu central */}
      <div className="hero__content">
        <h1 className="hero__title">
          THÉO SURY
        </h1>
        <p className="hero__subtitle">
          Chef-opérateur & Technicien lumière
        </p>
        <p className="hero__specialization">
          Fiction, clips & formats courts
        </p>
        <p className="hero__location">
          Lille / Paris
        </p>
        <div className="hero__cta">
          <a href="#hero-projects" className="btn btn-primary">
            Voir mes projets
          </a>
          <a href="#contact" className="btn">
            Me contacter
          </a>
        </div>
      </div>

      {/* Controls du slider */}
      <button 
        className="hero__arrow hero__arrow--left"
        onClick={handlePrev}
        aria-label="Image précédente"
      >
        ‹
      </button>
      <button 
        className="hero__arrow hero__arrow--right"
        onClick={handleNext}
        aria-label="Image suivante"
      >
        ›
      </button>

      {/* Indicateurs */}
      <div className="hero__indicators">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`hero__indicator ${
              index === currentImageIndex ? 'hero__indicator--active' : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll">
        <a href="#films" className="hero__scroll-link">
          <span className="hero__scroll-text">Scroll</span>
          <span className="hero__scroll-line"></span>
        </a>
      </div>
    </section>
  );
};

export default Hero;
