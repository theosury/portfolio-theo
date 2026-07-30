import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsData } from '../data/projectsData';
import './FilmDetail.css';

const FilmDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Trouver le projet correspondant au slug
  const project = projectsData.films.find(film => film.id === slug);

  // Titre dynamique
  useEffect(() => {
    if (project) {
      document.title = `${project.title} | Théo Sury`;
    }
  }, [project]);

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
  // La vignette générique ne vaut pas un visuel : inutile d'ouvrir la fiche
  // sur un grand bloc gris quand le projet n'a rien à montrer.
  const aVisuel = project.thumbnail && !project.thumbnail.includes('placeholder');
  const hasVideo = project.youtubeId || project.vimeoId || project.arteId || project.videoFile;

  // Plusieurs vidéos : fichiers hébergés, YouTube et/ou Vimeo, dans le même
  // carrousel. Les fichiers passent en premier : c'est le travail de Théo.
  const multipleVideos = [
    ...(project.videoFiles || []).map((video) => ({ ...video, platform: 'file' })),
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

  const nextVideo = () => {
    if (hasMultipleVideos) {
      setCurrentVideoIndex((prev) => (prev + 1) % multipleVideos.length);
    }
  };

  const prevVideo = () => {
    if (hasMultipleVideos) {
      setCurrentVideoIndex((prev) =>
        prev === 0 ? multipleVideos.length - 1 : prev - 1
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
        <div className="film-detail__video">
          <video
            src={project.videoFile}
            poster={project.thumbnail}
            title={project.title}
            controls
            playsInline
            preload="metadata"
          ></video>
        </div>
      );
    }

    if (project.youtubeId) {
      return <YouTubePlayer videoId={project.youtubeId} title={project.title} />;
    }
    
    if (project.vimeoId) {
      return (
        <div className="film-detail__video">
          <iframe
            src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=0&quality=1080p`}
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

  // Rendu carrousel de vidéos (YouTube et/ou Vimeo)
  const renderVideoCarousel = () => {
    if (!hasMultipleVideos) return null;

    const currentVideo = multipleVideos[currentVideoIndex];
    const currentTitle =
      currentVideo.title || `${project.title} - Vidéo ${currentVideoIndex + 1}`;

    return (
      <div className="film-detail__video-carousel">
        {currentVideo.title && (
          <h4 className="film-detail__video-carousel-title">{currentVideo.title}</h4>
        )}

        <div className="film-detail__video-carousel-container">
          {currentVideo.platform === 'file' ? (
            <div
              className={`film-detail__video ${
                currentVideo.vertical ? 'film-detail__video--vertical' : ''
              }`}
            >
              <video
                key={currentVideo.file}
                src={currentVideo.file}
                poster={currentVideo.poster}
                title={currentTitle}
                controls
                playsInline
                preload="metadata"
              ></video>
            </div>
          ) : currentVideo.platform === 'vimeo' ? (
            <VimeoPlayer
              videoId={currentVideo.id}
              hash={currentVideo.hash}
              title={currentTitle}
            />
          ) : (
            <YouTubePlayer videoId={currentVideo.id} title={currentTitle} />
          )}

          {multipleVideos.length > 1 && (
            <>
              <button
                className="film-detail__video-nav film-detail__video-nav--prev"
                onClick={prevVideo}
                aria-label="Vidéo précédente"
              >
                ‹
              </button>
              <button
                className="film-detail__video-nav film-detail__video-nav--next"
                onClick={nextVideo}
                aria-label="Vidéo suivante"
              >
                ›
              </button>
            </>
          )}
        </div>
        
        {multipleVideos.length > 1 && (
          <div className="film-detail__video-dots">
            {multipleVideos.map((_, index) => (
              <button
                key={index}
                className={`film-detail__video-dot ${index === currentVideoIndex ? 'active' : ''}`}
                onClick={() => setCurrentVideoIndex(index)}
                aria-label={`Voir vidéo ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="film-detail">
        <div className="film-detail__container">
          <button className="film-detail__close" onClick={() => navigate('/films')} aria-label="Retour aux films">×</button>
          
          <div className="film-detail__content">
            {/* Vidéo(s) ou Images */}
            {hasMultipleVideos ? (
              <>
                {renderVideoCarousel()}
                
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
                    <button className="film-detail__nav film-detail__nav--prev" onClick={prevImage} aria-label="Image précédente">‹</button>
                    <button className="film-detail__nav film-detail__nav--next" onClick={nextImage} aria-label="Image suivante">›</button>
                    <div className="film-detail__counter" aria-live="polite">
                      {currentImageIndex + 1} / {project.images.length}
                    </div>
                  </>
                )}
              </div>
            ) : aVisuel ? (
              <div className="film-detail__no-media">
                <img src={project.thumbnail} alt={project.title} />
              </div>
            ) : null}

            {/* Informations */}
            <div className="film-detail__info">
              <h1 className="film-detail__title">{project.title}</h1>

              {project.status && (
                <div className="film-detail__status">
                  <span className="film-detail__status-badge" data-status={project.status}>{project.status}</span>
                </div>
              )}

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
                'artiste', 'realisateur', 'realisateurs', 'realisatrice', 'realisatrices', 'scenariste', 'dirProd', 'producteur', 'chargeeProd',
                'premierAssRealPrepa', 'premierAssReal', 'secondAssReal', 'troisiemeAssistantReal', 'script', 'scripte', 'choregraphe',
                'chefOp', 'cheffeOp', 'coChefOp', 'cadreur', 'cadreurB', 'assistantCam', 'secondAssistantCam', 'troisiemeAssistantCam',
                'dit', 'steadicam', 'photo', 'chefElectro', 'chefElectroRenfort', 'electros', 'chefMachino', 'cheffeMachino',
                'machino', 'machinos', 'assistantMachino', 'renforts', 'son', 'assistantSon', 'assistantsSon', 'perchman', 'mixage', 'soundDesign', 'musique', 'monteurSon',
                'monteur', 'montageSon', 'etalonneur', 'vfx', 'graphisme', 'generique',
                'directionArtistique', 'directriceArtistique', 'assDirectriceArtistique', 'cheffeDecoratrice', 'assistanteDecoratrice',
                'deco', 'renfortDeco', 'accessoiriste', 'costume', 'costumiere', 'chefHMC', 'maquillage',
                'coiffure', 'regisseur', 'regisseurs', 'regisseurGeneral', 'assistRegie', 'prodExec',
                'assistProd', 'stagiaires', 'conseillereMontage', 'mastering', 'casting', 'cadreuse', 'concept',
                'coordinatriceIntimite', 'responsableSecurite'
              ];
                const hasTeamInfo = teamFields.some(field => project[field]);
                return hasTeamInfo;
              })() && (
                <div className="film-detail__team">
                  <h3>Équipe</h3>
                  <ul>
                    {Object.entries({
                      artiste: "Artiste",
                      realisateur: "Réalisation",
                      realisateurs: "Réalisation",
                      realisatrice: "Réalisation",
                      realisatrices: "Réalisation",
                      scenariste: "Scénario",
                      dirProd: "Direction de production",
                      producteur: "Producteur",
                      chargeeProd: "Chargée de production",
                      premierAssRealPrepa: "1er assistant réalisation (préparation)",
                      premierAssReal: "1er assistant réalisation",
                      secondAssReal: "2ème assistant réalisation",
                      troisiemeAssistantReal: "3ème assistant réalisation",
                      script: "Script",
                      scripte: "Scripte",
                      choregraphe: "Chorégraphe",
                      chefOp: "Chef opérateur",
                      cheffeOp: "Cheffe opératrice",
                      coChefOp: "Co-chef opérateur",
                      cadreur: "Cadreur",
                      cadreurB: "Cadreur caméra B",
                      assistantCam: "1er assistant caméra",
                      secondAssistantCam: "2ème assistant caméra",
                      troisiemeAssistantCam: "3ème assistant caméra",
                      dit: "DIT",
                      steadicam: "Steadicam",
                      photo: "Photographe plateau",
                      chefElectro: "Chef électricien",
                      chefElectroRenfort: "Chef électricien renfort",
                      electros: "Électriciens",
                      chefMachino: "Chef machiniste",
                      cheffeMachino: "Cheffe machiniste",
                      machino: "Machiniste",
                      machinos: "Machinistes",
                      assistantMachino: "Assistant machiniste",
                      renforts: "Renforts",
                      son: "Prise de son",
                      assistantSon: "Assistant son",
                      assistantsSon: "Assistants son",
                      perchman: "Perchman",
                      mixage: "Mixage",
                      soundDesign: "Sound design",
                      musique: "Musique originale",
                      monteurSon: "Monteur son",
                      monteur: "Montage image",
                      montageSon: "Montage son",
                      etalonneur: "Étalonnage",
                      vfx: "VFX",
                      graphisme: "Graphisme",
                      generique: "Générique",
                      directionArtistique: "Direction artistique",
                      directriceArtistique: "Directrice artistique",
                      assDirectriceArtistique: "Assistante direction artistique",
                      cheffeDecoratrice: "Cheffe décoratrice",
                      assistanteDecoratrice: "Assistante décoration",
                      deco: "Décoration",
                      renfortDeco: "Renfort décoration",
                      accessoiriste: "Accessoiriste",
                      costume: "Costume",
                      costumiere: "Costumière",
                      chefHMC: "Chef HMC",
                      maquillage: "Maquillage",
                      coiffure: "Coiffure",
                      regisseur: "Régisseur général",
                      regisseurs: "Régie",
                      regisseurGeneral: "Régie générale",
                      assistRegie: "Assistant régie",
                      prodExec: "Production exécutive",
                      assistProd: "Assistant production",
                      stagiaires: "Stagiaires",
                      conseillereMontage: "Conseillère montage",
                      mastering: "Mastering",
                      casting: "Casting",
                      cadreuse: "Cadreuse",
                      concept: "Concept",
                      coordinatriceIntimite: "Coordinatrice d'intimité",
                      responsableSecurite: "Responsable sécurité"
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
                  <p>{project.cast.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal plein écran pour les images */}
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

// Composant YouTube Player - iframe simple avec qualité HD
const YouTubePlayer = ({ videoId, title }) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&vq=hd1080`;

  return (
    <div className="film-detail__video">
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

// Composant Vimeo Player - le hash est requis pour les vidéos non répertoriées
const VimeoPlayer = ({ videoId, hash, title }) => {
  const embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=0&quality=1080p${
    hash ? `&h=${hash}` : ''
  }`;

  return (
    <div className="film-detail__video">
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default FilmDetail;