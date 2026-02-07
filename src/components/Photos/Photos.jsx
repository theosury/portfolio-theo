import React, { useState, useEffect } from 'react';
import './Photos.css';

function Photos() {
  const [photos, setPhotos] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fonction pour mélanger un tableau (algorithme Fisher-Yates)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    // Charge automatiquement toutes les images du dossier /images/photos/
    const imageModules = import.meta.glob('/public/images/photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
      eager: true,
      as: 'url'
    });

    const imageUrls = Object.keys(imageModules).map(path => {
      // Convertit le chemin /public/images/photos/photo.jpg en /images/photos/photo.jpg
      return path.replace('/public', '');
    });

    // Mélange les photos de façon aléatoire
    const shuffledPhotos = shuffleArray(imageUrls);
    setPhotos(shuffledPhotos);
  }, []);

  // Gestion du scroll du body via useEffect
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentIndex((currentIndex + 1) % photos.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
  };

  // Gestion des touches clavier
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentIndex]);

  return (
    <section id="photographie" className="photos-section">
      <div className="container">
        <header className="page-header-unified">
          <h2 className="page-title-unified">Photos</h2>
        </header>

        <div className="photos-grid" role="list">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="photo-item"
              role="listitem"
              tabIndex={0}
              onClick={() => openLightbox(index)}
              onKeyDown={(e) => { if (e.key === 'Enter') openLightbox(index); }}
            >
              <img src={photo} alt={`Photographie ${index + 1}`} loading="lazy" />
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <p className="no-photos">Aucune photo trouvée. Ajoute des images dans le dossier <code>/public/images/photos/</code></p>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox" role="dialog" aria-label="Visionneuse de photos" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Fermer">
            ×
          </button>

          <button
            className="lightbox-nav lightbox-prev"
            aria-label="Photo précédente"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            ‹
          </button>

          <img
            src={photos[currentIndex]}
            alt={`Photographie ${currentIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="lightbox-nav lightbox-next"
            aria-label="Photo suivante"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            ›
          </button>

          <div className="lightbox-counter" aria-live="polite">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </section>
  );
}

export default Photos;
