import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsData } from '../data/projectsData';
import './FilmDetail.css';

const FilmDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // Trouver le projet correspondant au slug
  const project = projectsData.films.find(film => film.id === slug);

  // Si projet introuvable, rediriger vers /films
  useEffect(() => {
    if (!project) {
      navigate('/films');
    }
  }, [project, navigate]);

  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showImageModal) {
          setShowImageModal(false);
        } else {
          navigate('/films');
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [navigate, showImageModal]);

  if (!project) return null;

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
        <div className="film-detail__video">
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
        <div className="film-detail__video">
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
        <div className="film-detail__video">
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
    
    const shouldMute = project.youtubeIds.length > 1 ? 1 : 0;
    
    return (
      <div className="film-detail__videos-grid" data-video-count={project.youtubeIds.length}>
        {project.youtubeIds.map((videoData, index) => (
          <div key={index} className="film-detail__video-item">
            {videoData.title && (
              <h4 className="film-detail__video-title">{videoData.title}</h4>
            )}
            <div className="film-detail__video">
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
      <div className="film-detail">
        <div className="film-detail__container">
          <button className="film-detail__close" onClick={() => navigate('/films')}>×</button>
          
          <div className="film-detail__content">
            {/* Vidéo(s) ou Images */}
            {hasMultipleVideos ? (
              <>
                {renderMultipleVideos()}
                
                {/* Galerie de thumbnails sous les vidéos */}
                {hasImages && (
                  <div className="film-detail__thumbnails">
                    {project.images.map((image, index) => (
                      <div
                        key={index}
                        className="film-detail__thumbnail"
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
                  <div className="film-detail__thumbnails">
                    {project.images.map((image, index) => (
                      <div
                        key={index}
                        className="film-detail__thumbnail"
                        onClick={() => openImageModal(index)}
                      >
                        <img src={image} alt={`${project.title} - Photo ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : hasImages ? (
              <div className="film-detail__gallery">
                <img 
                  src={project.images[currentImageIndex]} 
                  alt={`${project.title} - ${currentImageIndex + 1}`}
                  className="film-detail__image"
                />
                {project.images.length > 1 && (
                  <>
                    <button className="film-detail__nav film-detail__nav--prev" onClick={prevImage}>‹</button>
                    <button className="film-detail__nav film-detail__nav--next" onClick={nextImage}>›</button>
                    <div className="film-detail__counter">
                      {currentImageIndex + 1} / {project.images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="film-detail__no-media">
                <img src={project.thumbnail} alt={project.title} />
              </div>
            )}

            {/* Informations */}
            <div className="film-detail__info">
              <h1 className="film-detail__title">{project.title}</h1>
              
              <div className="film-detail__meta">
                <span className="film-detail__year">{project.month || project.year}</span>
                <span className="film-detail__separator">•</span>
                <span className="film-detail__role">{project.role}</span>
              </div>

              {project.production && (
                <p className="film-detail__production">{project.production}</p>
              )}

              {project.description && (
                <p className="film-detail__description">{project.description}</p>
              )}

              {project.synopsis && (
                <p className="film-detail__synopsis">{project.synopsis}</p>
              )}

              {/* Specs techniques */}
              {project.specs && Object.keys(project.specs).length > 0 && (
                <div className="film-detail__specs">
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
                <div className="film-detail__team">
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
                <div className="film-detail__cast">
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

      {/* Modal plein écran pour les images */}
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

export default FilmDetail;
