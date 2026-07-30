import React, { useState, useEffect, useRef } from 'react';
import './ProjectModal.css';

const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const modalRef = useRef(null);

  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showImageModal) {
          setShowImageModal(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, showImageModal]);

  // Empêcher le scroll du body quand la modale est ouverte
  useEffect(() => {
    const scrollY = window.scrollY;

    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.WebkitOverflowScrolling = 'touch';

    return () => {
      const bodyScrollTop = parseInt(document.body.style.top || '0') * -1;

      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.WebkitOverflowScrolling = '';

      window.scrollTo(0, bodyScrollTop);
    };
  }, []);

  // Swipe horizontal pour fermer la modal via ref
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      modal.style.transition = 'none';
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;

      currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        e.preventDefault();
        const opacity = Math.max(1 - Math.abs(diffX) / 600, 0.3);
        const rotation = (diffX / window.innerWidth) * 15;
        modal.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
        modal.style.opacity = `${opacity}`;
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;

      const diffX = currentX - startX;
      const distance = Math.abs(diffX);
      const threshold = window.innerWidth * 0.25;

      if (distance > threshold) {
        modal.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        const exitDistance = diffX > 0 ? window.innerWidth + 100 : -(window.innerWidth + 100);
        const rotation = (diffX / window.innerWidth) * 20;
        modal.style.transform = `translateX(${exitDistance}px) rotate(${rotation}deg)`;
        modal.style.opacity = '0';
        setTimeout(() => onClose(), 300);
      } else {
        modal.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
        modal.style.transform = '';
        modal.style.opacity = '';
        setTimeout(() => {
          if (modal) modal.style.transition = '';
        }, 400);
      }
    };

    modal.addEventListener('touchstart', handleTouchStart, { passive: false });
    modal.addEventListener('touchmove', handleTouchMove, { passive: false });
    modal.addEventListener('touchend', handleTouchEnd, { passive: true });
    modal.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      modal.removeEventListener('touchstart', handleTouchStart);
      modal.removeEventListener('touchmove', handleTouchMove);
      modal.removeEventListener('touchend', handleTouchEnd);
      modal.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [onClose]);

  const hasImages = project.images && project.images.length > 0;
  const hasVideo = project.youtubeId || project.vimeoId || project.arteId || project.videoFile;

  // Plusieurs vidéos : YouTube et/ou Vimeo, réunies dans la même grille
  const multipleVideos = [
    ...(project.youtubeIds || []).map((video) => ({ ...video, platform: 'youtube' })),
    ...(project.vimeoIds || []).map((video) => ({ ...video, platform: 'vimeo' })),
  ];
  const hasMultipleVideos = multipleVideos.length > 0;

  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  // Rendu du player vidéo selon la plateforme
  const renderVideoPlayer = () => {
    // Vidéo hébergée sur le site (fichier dans /public/videos)
    if (project.videoFile) {
      return (
        <div className="modal__video">
          <video
            src={project.videoFile}
            poster={project.thumbnail}
            title={project.title}
            controls
            autoPlay
            playsInline
            preload="none"
          ></video>
        </div>
      );
    }

    if (project.youtubeId) {
      return (
        <div className="modal__video">
          <iframe
            src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&mute=0`}
            title={project.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    if (project.vimeoId) {
      return (
        <div className="modal__video">
          <iframe
            src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0`}
            title={project.title}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    if (project.arteId) {
      return (
        <div className="modal__video">
          <iframe
            src={`https://www.arte.tv/embeds/fr/${project.arteId}?autoplay=true&mute=0`}
            title={project.title}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    return null;
  };

  // Rendu de plusieurs vidéos (YouTube et/ou Vimeo)
  const renderMultipleVideos = () => {
    if (!hasMultipleVideos) return null;

    const shouldMute = multipleVideos.length > 1 ? 1 : 0;

    return (
      <div className="modal__videos-grid" data-video-count={multipleVideos.length}>
        {multipleVideos.map((videoData, index) => (
          <div key={index} className="modal__video-item">
            {videoData.title && (
              <h4 className="modal__video-title">{videoData.title}</h4>
            )}
            <div className="modal__video">
              <iframe
                src={
                  videoData.platform === 'vimeo'
                    ? `https://player.vimeo.com/video/${videoData.id}?autoplay=1&muted=${shouldMute}${videoData.hash ? `&h=${videoData.hash}` : ''}`
                    : `https://www.youtube.com/embed/${videoData.id}?autoplay=1&mute=${shouldMute}`
                }
                title={videoData.title || `${project.title} - Vidéo ${index + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="modal-overlay" role="dialog" aria-label={project.title} onClick={onClose}>
        <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
          <button className="modal__close" onClick={onClose} aria-label="Fermer">×</button>

          <div className="modal__content">
            {/* Vidéo(s) ou Images */}
            {hasMultipleVideos ? (
              <>
                {renderMultipleVideos()}

                {hasImages && (
                  <div className="modal__thumbnails">
                    {project.images.map((image, index) => (
                      <div
                        key={index}
                        className="modal__thumbnail"
                        tabIndex={0}
                        role="button"
                        aria-label={`Voir photo ${index + 1}`}
                        onClick={() => openImageModal(index)}
                        onKeyDown={(e) => { if (e.key === 'Enter') openImageModal(index); }}
                      >
                        <img src={image} alt={`${project.title} - Photo ${index + 1}`} loading="lazy" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : hasVideo ? (
              <>
                {renderVideoPlayer()}

                {hasImages && (
                  <div className="modal__thumbnails">
                    {project.images.map((image, index) => (
                      <div
                        key={index}
                        className="modal__thumbnail"
                        tabIndex={0}
                        role="button"
                        aria-label={`Voir photo ${index + 1}`}
                        onClick={() => openImageModal(index)}
                        onKeyDown={(e) => { if (e.key === 'Enter') openImageModal(index); }}
                      >
                        <img src={image} alt={`${project.title} - Photo ${index + 1}`} loading="lazy" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : hasImages ? (
              <div className="modal__gallery">
                <img
                  src={project.images[currentImageIndex]}
                  alt={`${project.title} - ${currentImageIndex + 1}`}
                  className="modal__image"
                />
                {project.images.length > 1 && (
                  <>
                    <button className="modal__nav modal__nav--prev" onClick={prevImage} aria-label="Image précédente">‹</button>
                    <button className="modal__nav modal__nav--next" onClick={nextImage} aria-label="Image suivante">›</button>
                    <div className="modal__counter" aria-live="polite">
                      {currentImageIndex + 1} / {project.images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="modal__no-media">
                <img src={project.thumbnail} alt={project.title} />
              </div>
            )}

            {/* Informations */}
            <div className="modal__info">
              {project.artiste && (
                <p className="modal__artiste">{project.artiste}</p>
              )}
              <h2 className="modal__title">{project.title}</h2>

              <div className="modal__meta">
                <span className="modal__year">{project.month || project.year}</span>
                <span className="modal__separator">•</span>
                <span className="modal__role">{project.role}</span>
              </div>

              {project.production && (
                <p className="modal__production">{project.production}</p>
              )}

              {project.description && (
                <p className="modal__description">{project.description}</p>
              )}

              {project.synopsis && (
                <p className="modal__synopsis">{project.synopsis}</p>
              )}

              {/* Specs techniques */}
              {project.specs && Object.keys(project.specs).length > 0 && (
                <div className="modal__specs">
                  <h3>Informations techniques</h3>
                  <ul>
                    {Object.entries(project.specs).map(([key, value]) => (
                      value && <li key={key}><strong>{key}:</strong> {value}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Équipe */}
              {(() => {
                const teamFields = [
                  'realisateur', 'realisateurs', 'realisatrice', 'assistantReal', 'script',
                  'chefOp', 'coChefOp', 'assistantCam', 'secondAssistantCam', 'troisiemeAssistantCam',
                  'dit', 'steadicam', 'photo', 'chefElectro', 'electros', 'chefMachino',
                  'machino', 'renforts', 'son', 'perchman', 'mixage', 'soundDesign', 'musique',
                  'monteur', 'montageSon', 'etalonneur', 'vfx', 'graphisme', 'generique',
                  'directionArtistique', 'deco', 'accessoiriste', 'costume', 'maquillage',
                  'coiffure', 'regisseur', 'assistRegie', 'producteur', 'prodExec',
                  'assistProd', 'stagiaires'
                ];
                const hasTeamInfo = teamFields.some(field => project[field]);
                return hasTeamInfo;
              })() && (
                <div className="modal__team">
                  <h3>Équipe</h3>
                  <ul>
                    {Object.entries({
                      realisateur: "Réalisation",
                      realisateurs: "Réalisation",
                      realisatrice: "Réalisation",
                      assistantReal: "Assistant réalisation",
                      script: "Script",
                      chefOp: "Chef opérateur",
                      coChefOp: "Co-chef opérateur",
                      assistantCam: "1er assistant caméra",
                      secondAssistantCam: "2ème assistant caméra",
                      troisiemeAssistantCam: "3ème assistant caméra",
                      dit: "DIT",
                      steadicam: "Steadicam",
                      photo: "Photographe plateau",
                      chefElectro: "Chef électricien",
                      electros: "Électros",
                      chefMachino: "Chef machiniste",
                      machino: "Machiniste",
                      renforts: "Renforts",
                      son: "Prise de son",
                      perchman: "Perchman",
                      mixage: "Mixage",
                      soundDesign: "Sound design",
                      musique: "Musique originale",
                      monteur: "Montage image",
                      montageSon: "Montage son",
                      etalonneur: "Étalonnage",
                      vfx: "VFX",
                      graphisme: "Graphisme",
                      generique: "Générique",
                      directionArtistique: "Direction artistique",
                      deco: "Décoration",
                      accessoiriste: "Accessoiriste",
                      costume: "Costume",
                      maquillage: "Maquillage",
                      coiffure: "Coiffure",
                      regisseur: "Régisseur général",
                      assistRegie: "Assistant régie",
                      producteur: "Producteur",
                      prodExec: "Production exécutive",
                      assistProd: "Assistant production",
                      stagiaires: "Stagiaires",
                    }).map(([key, label]) =>
                      project[key] ? (
                        <li key={key}>
                          <strong>{label} :</strong> {project[key]}
                        </li>
                      ) : null
                    )}
                  </ul>
                </div>
              )}

              {/* Cast */}
              {project.cast && project.cast.length > 0 && (
                <div className="modal__cast">
                  <h3>Distribution</h3>
                  <ul>
                    {project.cast.map((actor, index) => (
                      <li key={index}>{actor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal plein écran pour les images (quand on clique sur un thumbnail) */}
      {showImageModal && hasImages && (
        <div className="image-modal-overlay" role="dialog" aria-label="Image en plein écran" onClick={() => setShowImageModal(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal__close" onClick={() => setShowImageModal(false)} aria-label="Fermer">×</button>

            <img
              src={project.images[currentImageIndex]}
              alt={`${project.title} - ${currentImageIndex + 1}`}
              className="image-modal__image"
            />

            {project.images.length > 1 && (
              <>
                <button className="image-modal__nav image-modal__nav--prev" onClick={prevImage} aria-label="Image précédente">‹</button>
                <button className="image-modal__nav image-modal__nav--next" onClick={nextImage} aria-label="Image suivante">›</button>
                <div className="image-modal__counter" aria-live="polite">
                  {currentImageIndex + 1} / {project.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectModal;
