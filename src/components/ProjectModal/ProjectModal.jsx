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
    document.body.style.overflow = 'hidden';
    // Empêcher le pull-to-refresh sur mobile
    document.body.style.overscrollBehavior = 'none';
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.overscrollBehavior = 'auto';
    };
  }, []);

  // Swipe-to-close sur mobile
  useEffect(() => {
    let startY = 0;
    let currentY = 0;
    
    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      currentY = e.touches[0].clientY;
      // Si on est en haut de la modal et qu'on swipe vers le bas
      const modal = document.querySelector('.modal');
      if (modal && modal.scrollTop === 0 && currentY - startY > 50) {
        onClose();
      }
    };
    
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.addEventListener('touchstart', handleTouchStart);
      modal.addEventListener('touchmove', handleTouchMove);
    }
    
    return () => {
      if (modal) {
        modal.removeEventListener('touchstart', handleTouchStart);
        modal.removeEventListener('touchmove', handleTouchMove);
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