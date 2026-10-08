import React, { useState, useEffect } from 'react';
import { photos as listePhotos } from '../../data/photosData';
import './Photos.css';

const nomBase = (f) => f.replace(/\.[^.]+$/, '');

function Photos() {
  const photos = listePhotos.map((p) => `/images/photos/${p.fichier}`);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
          <h1 className="page-title-unified">Photos</h1>
        </header>

        <p className="page-intro">
          Des photographies plus anciennes, argentiques et numériques, prises avant et en marge des tournages.
        </p>

        {/* Mosaïque : chaque photo garde son format */}
        <div className="photos-grid" role="list">
          {listePhotos.map((photo, index) => (
            <button
              key={photo.fichier}
              type="button"
              className="photo-item"
              role="listitem"
              style={{ aspectRatio: `${photo.largeur} / ${photo.hauteur}` }}
              onClick={() => openLightbox(index)}
              aria-label={`Agrandir la photographie ${index + 1}`}
            >
              <img
                src={`/images/photos/vignettes/${nomBase(photo.fichier)}.jpg`}
                alt={`Photographie ${index + 1}`}
                loading="lazy"
                onLoad={(e) => e.currentTarget.classList.add('chargee')}
              />
            </button>
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
