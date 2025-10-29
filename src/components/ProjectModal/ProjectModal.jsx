import React, { useState, useEffect } from 'react';
import './ProjectModal.css';

const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

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
    // Pour tous les navigateurs
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    
    // Pour Safari iOS
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.WebkitOverflowScrolling = 'touch';
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.overscrollBehavior = 'auto';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.WebkitOverflowScrolling = '';
    };
  }, []);

  // Swipe horizontal pour fermer la modal (style Tinder)
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isHorizontalSwipe = false;
    let modalElement = null;
    
    const handleTouchStart = (e) => {
      modalElement = document.querySelector('.modal');
      if (!modalElement) return;
      
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      isHorizontalSwipe = false;
    };
    
    const handleTouchMove = (e) => {
      if (!isDragging || !modalElement) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      
      const diffX = currentX - startX;
      const diffY = currentY - startY;
      
      // Déterminer si c'est un swipe horizontal (seulement au début du mouvement)
      if (!isHorizontalSwipe && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
        return; // Mouvement trop petit, on attend
      }
      
      if (!isHorizontalSwipe) {
        // Déterminer la direction une seule fois
        isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
      }
      
      // Si c'est un swipe horizontal
      if (isHorizontalSwipe) {
        // Empêcher le scroll pendant le swipe horizontal
        e.preventDefault();
        
        // Distance horizontale absolue
        const distance = Math.abs(diffX);
        
        // Appliquer la transformation uniquement horizontale
        const translateX = diffX * 0.7;
        
        // Opacité basée sur la distance (commence à diminuer après 100px)
        const opacity = Math.max(1 - distance / 600, 0.3);
        
        // Rotation légère pour l'effet "carte qui part" (max 20deg)
        const rotation = (diffX / window.innerWidth) * 20;
        
        modalElement.style.transform = `translateX(${translateX}px) rotate(${rotation}deg)`;
        modalElement.style.opacity = `${opacity}`;
        modalElement.style.transition = 'none';
        
        // Fermer si on dépasse 200px (comme Tinder - course plus longue)
        if (distance > 200) {
          isDragging = false;
          // Animation de sortie fluide
          modalElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
          const exitDistance = diffX > 0 ? window.innerWidth : -window.innerWidth;
          modalElement.style.transform = `translateX(${exitDistance}px) rotate(${rotation * 1.5}deg)`;
          modalElement.style.opacity = '0';
          setTimeout(() => onClose(), 250);
        }
      }
      // Sinon, c'est un scroll vertical, on laisse faire
    };
    
    const handleTouchEnd = () => {
      if (!modalElement) return;
      
      isDragging = false;
      isHorizontalSwipe = false;
      
      // Réinitialiser la position avec transition élastique (effet rebond)
      modalElement.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
      modalElement.style.transform = '';
      modalElement.style.opacity = '';
      
      // Nettoyer la transition après l'animation
      setTimeout(() => {
        if (modalElement) {
          modalElement.style.transition = '';
        }
      }, 400);
    };
    
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.addEventListener('touchstart', handleTouchStart, { passive: false });
      modal.addEventListener('touchmove', handleTouchMove, { passive: false });
      modal.addEventListener('touchend', handleTouchEnd, { passive: true });
      modal.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    }
    
    return () => {
      if (modal) {
        modal.removeEventListener('touchstart', handleTouchStart);
        modal.removeEventListener('touchmove', handleTouchMove);
        modal.removeEventListener('touchend', handleTouchEnd);
        modal.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, [onClose]);

  const hasImages = project.images && project.images.length > 0;
  const hasVideo = project.youtubeId || project.vimeoId || project.arteId;
  const hasMultipleVideos = project.youtubeIds && project.youtubeIds.length > 0;

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

  // Rendu de plusieurs vidéos YouTube
  const renderMultipleVideos = () => {
    if (!project.youtubeIds || project.youtubeIds.length === 0) return null;
    
    // Si plusieurs vidéos, on mute par défaut
    const shouldMute = project.youtubeIds.length > 1 ? 1 : 0;
    
    return (
      <div className="modal__videos-grid" data-video-count={project.youtubeIds.length}>
        {project.youtubeIds.map((videoData, index) => (
          <div key={index} className="modal__video-item">
            {videoData.title && (
              <h4 className="modal__video-title">{videoData.title}</h4>
            )}
            <div className="modal__video">
              <iframe
                src={`https://www.youtube.com/embed/${videoData.id}?autoplay=1&mute=${shouldMute}`}
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
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal__close" onClick={onClose}>×</button>
          
          <div className="modal__content">
            {/* Vidéo(s) ou Images */}
            {hasMultipleVideos ? (
              <>
                {renderMultipleVideos()}
                
                {/* Galerie de thumbnails sous les vidéos */}
                {hasImages && (
                  <div className="modal__thumbnails">
                    {project.images.map((image, index) => (
                      <div
                        key={index}
                        className="modal__thumbnail"
                        onClick={() => openImageModal(index)}
                      >
                        <img src={image} alt={`${project.title} - Photo ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : hasVideo ? (
              <>
                {renderVideoPlayer()}
                
                {/* Galerie de thumbnails sous la vidéo */}
                {hasImages && (
                  <div className="modal__thumbnails">
                    {project.images.map((image, index) => (
                      <div
                        key={index}
                        className="modal__thumbnail"
                        onClick={() => openImageModal(index)}
                      >
                        <img src={image} alt={`${project.title} - Photo ${index + 1}`} />
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
                    <button className="modal__nav modal__nav--prev" onClick={prevImage}>‹</button>
                    <button className="modal__nav modal__nav--next" onClick={nextImage}>›</button>
                    <div className="modal__counter">
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
                      // 🎬 Réalisation
                      realisateur: "Réalisation",
                      realisateurs: "Réalisation",
                      realisatrice: "Réalisation",
                      assistantReal: "Assistant réalisation",
                      script: "Script",

                      // 📷 Image
                      chefOp: "Chef opérateur",
                      coChefOp: "Co-chef opérateur",
                      assistantCam: "1er assistant caméra",
                      secondAssistantCam: "2ème assistant caméra",
                      troisiemeAssistantCam: "3ème assistant caméra",
                      dit: "DIT",
                      steadicam: "Steadicam",
                      photo: "Photographe plateau",

                      // 💡 Lumière / machinerie
                      chefElectro: "Chef électricien",
                      electros: "Électros",
                      chefMachino: "Chef machiniste",
                      machino: "Machiniste",
                      renforts: "Renforts",

                      // 🎙️ Son
                      son: "Prise de son",
                      perchman: "Perchman",
                      mixage: "Mixage",
                      soundDesign: "Sound design",
                      musique: "Musique originale",

                      // 🖥️ Post-production
                      monteur: "Montage image",
                      montageSon: "Montage son",
                      etalonneur: "Étalonnage",
                      vfx: "VFX",
                      graphisme: "Graphisme",
                      generique: "Générique",

                      // 🎨 Décors / habillage
                      directionArtistique: "Direction artistique",
                      deco: "Décoration",
                      accessoiriste: "Accessoiriste",
                      costume: "Costume",
                      maquillage: "Maquillage",
                      coiffure: "Coiffure",

                      // 📋 Régie / production
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
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal__close" onClick={() => setShowImageModal(false)}>×</button>
            
            <img 
              src={project.images[currentImageIndex]} 
              alt={`${project.title} - ${currentImageIndex + 1}`}
              className="image-modal__image"
            />
            
            {project.images.length > 1 && (
              <>
                <button className="image-modal__nav image-modal__nav--prev" onClick={prevImage}>‹</button>
                <button className="image-modal__nav image-modal__nav--next" onClick={nextImage}>›</button>
                <div className="image-modal__counter">
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