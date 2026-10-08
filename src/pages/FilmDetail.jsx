import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsData, projetsSecondaires } from '../data/projectsData';
import './FilmDetail.css';

// Même ordre que sur l'accueil : films terminés, en cours, puis autres tournages
const estSecondaire = (film) => projetsSecondaires.includes(film.id);
const ORDRE_FILMS = [
  ...projectsData.films.filter((f) => !estSecondaire(f) && !f.status),
  ...projectsData.films.filter((f) => !estSecondaire(f) && f.status),
  ...projectsData.films.filter(estSecondaire),
];

// Retour à l'accueil, là où l'on était avant d'ouvrir la fiche (sinon : section Films)
const retourAccueil = (navigate) => {
  let y = null;
  try { y = sessionStorage.getItem('retourAccueil'); } catch { /* stockage indisponible */ }
  navigate('/', { state: y !== null ? { retourY: Number(y) } : { section: 'films' } });
};

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
      navigate('/', { state: { section: 'films' } });
    }
  }, [project, navigate]);

  // Nouvelle fiche : on repart du premier visuel
  useEffect(() => {
    setCurrentImageIndex(0);
    setCurrentVideoIndex(0);
    setShowImageModal(false);
  }, [slug]);

  const position = ORDRE_FILMS.findIndex((f) => f.id === slug);
  const precedent = position >= 0 ? ORDRE_FILMS[(position - 1 + ORDRE_FILMS.length) % ORDRE_FILMS.length] : null;
  const suivant = position >= 0 ? ORDRE_FILMS[(position + 1) % ORDRE_FILMS.length] : null;

  // Fermer avec Échap ; flèches gauche/droite pour passer d'un projet à l'autre
  useEffect(() => {
    const handleEscape = (e) => {
      const modaleOuverte = document.querySelector('.image-modal-overlay');
      if (!modaleOuverte && !e.metaKey && !e.altKey && !e.ctrlKey && /^(INPUT|TEXTAREA)$/.test(e.target.tagName) === false) {
        if (e.key === 'ArrowLeft' && precedent) navigate(`/films/${precedent.id}`);
        if (e.key === 'ArrowRight' && suivant) navigate(`/films/${suivant.id}`);
      }
      if (e.key === 'Escape') {
        if (showImageModal) {
          setShowImageModal(false);
        } else {
          retourAccueil(navigate);
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [navigate, showImageModal, precedent, suivant]);

  if (!project) return null;

  // Les extraits en boucle, en grille. Celui qui sert d'aperçu au lecteur
  // YouTube n'est pas répété ; Feng Shui a déjà sa propre grille d'extraits.
  const boucleEnTete = !hasMultipleVideosFor(project) && !project.videoFile && project.youtubeId;
  const boucles = project.extraits ? [] : (project.boucles || []).slice(boucleEnTete ? 1 : 0);

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
      return <YouTubePlayer videoId={project.youtubeId} title={project.title} boucle={project.boucles?.[0] || project.boucle} />;
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
          <button className="film-detail__close" onClick={() => retourAccueil(navigate)} aria-label="Fermer la fiche">×</button>
          
          <div className="film-detail__content" key={project.id}>
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

              {boucles.length > 0 && (
                <div className="film-detail__extraits">
                  <h3>Extraits</h3>
                  <ExtraitsGrille
                    extraits={{ videos: boucles }}
                    ratio={project.boucleRatio}
                  />
                </div>
              )}

              {/* Extraits vidéo (grille, ex. post Instagram de la prod) */}
              {project.extraits && (
                <div className="film-detail__extraits">
                  <h3>{project.extraits.titre}</h3>
                  <ExtraitsGrille key={project.id} extraits={project.extraits} />
                </div>
              )}

              {/* Photos de plateau (grille, ouverture en grand au clic) */}
              {project.plateau && (
                <div className="film-detail__extraits">
                  <h3>{project.plateau.titre}</h3>
                  <PhotosPlateau key={project.id} plateau={project.plateau} titre={project.title} />
                </div>
              )}

              {/* Specs techniques */}
              {project.specs && Object.keys(project.specs).length > 0 && (
                <div className="film-detail__specs">
                  <h3>Informations techniques</h3>
                  <ul>
                    {Object.entries(project.specs).map(([key, value]) => (
                      value && (
                        <li key={key}>
                          <strong>{LIBELLES_SPECS[key] || key}</strong>
                          <span>{value}</span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              )}

              {/* Équipe : les postes clés, le reste replié */}
              <Equipe project={project} />

              {/* Cast */}
              {project.cast && project.cast.length > 0 && (
                <div className="film-detail__cast">
                  <h3>Distribution</h3>
                  <p>{project.cast.join(', ')}</p>
                </div>
              )}

            </div>
          </div>

          {precedent && suivant && (
            <nav className="film-detail__voyage" aria-label="Autres projets">
              <CarteVoyage film={precedent} sens="precedent" onClick={() => navigate(`/films/${precedent.id}`)} />
              <CarteVoyage film={suivant} sens="suivant" onClick={() => navigate(`/films/${suivant.id}`)} />
            </nav>
          )}
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

const hasMultipleVideosFor = (p) =>
  Boolean(p.videoFiles?.length || p.youtubeIds?.length || p.vimeoIds?.length);

// Lien vers le projet voisin : son premier extrait (ou sa vignette) et son titre
const CarteVoyage = ({ film, sens, onClick }) => {
  const boucle = film.boucles?.[0] || film.boucle;
  const image = boucle ? `${boucle}.jpg` : (film.thumbnail && !film.thumbnail.includes('placeholder') ? film.thumbnail : null);
  return (
    <button type="button" className={`film-detail__voyage-carte film-detail__voyage-carte--${sens}`} onClick={onClick}>
      {image && <span className="film-detail__voyage-image" style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />}
      <span className="film-detail__voyage-texte">
        <span className="film-detail__voyage-sens">{sens === 'precedent' ? '← Projet précédent' : 'Projet suivant →'}</span>
        <span className="film-detail__voyage-titre">{film.artiste ? `${film.artiste} : ${film.title}` : film.title}</span>
      </span>
    </button>
  );
};

// Lecteur YouTube en deux temps : tant qu'on n'a pas cliqué, on montre l'extrait
// du film en boucle (ou la miniature) sans l'habillage YouTube ; au clic, le
// vrai lecteur se lance.
const YouTubePlayer = ({ videoId, title, boucle }) => {
  const [lance, setLance] = useState(false);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&vq=hd1080${lance ? '&autoplay=1' : ''}`;

  if (lance) {
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
  }

  return (
    <button type="button" className="film-detail__video film-detail__video--attente" onClick={() => setLance(true)}>
      {boucle ? (
        <video poster={`${boucle}.jpg`} autoPlay muted loop playsInline>
          <source src={`${boucle}.mp4`} type="video/mp4" />
        </video>
      ) : (
        <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt="" />
      )}
      <span className="film-detail__lecture">
        <span className="film-detail__lecture-icone" aria-hidden="true">▶</span>
        Regarder le film
      </span>
    </button>
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

// Grille de photos de plateau. Au clic, la photo s'ouvre en plein écran
// (mêmes styles que la modale des images du film) ; flèches et Échap au clavier.
const PhotosPlateau = ({ plateau, titre }) => {
  const { photos, credit, legende, lien } = plateau;
  const [ouverte, setOuverte] = useState(null);
  const aller = (i) => setOuverte((i + photos.length) % photos.length);

  useEffect(() => {
    if (ouverte === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); setOuverte(null); }
      if (e.key === 'ArrowRight') aller(ouverte + 1);
      if (e.key === 'ArrowLeft') aller(ouverte - 1);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [ouverte]);

  return (
    <>
      <div className="film-detail__plateau-grid">
        {photos.map((src, i) => (
          <button key={src} onClick={() => setOuverte(i)} aria-label={`Agrandir la photo ${i + 1}`}>
            <img src={src} alt={`${titre} - sur le plateau ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>
      {legende && <p className="film-detail__extraits-credit">{legende}</p>}
      {(credit || lien) && (
        <p className="film-detail__extraits-credit">
          {credit && <>Photos : {credit}</>}
          {credit && lien && ' · '}
          {lien && (
            <a href={lien} target="_blank" rel="noopener noreferrer">Voir le post Instagram →</a>
          )}
        </p>
      )}

      {ouverte !== null && (
        <div className="image-modal-overlay" role="dialog" aria-label="Photo en plein écran" onClick={() => setOuverte(null)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal__close" onClick={() => setOuverte(null)} aria-label="Fermer">×</button>
            <img src={photos[ouverte]} alt={`${titre} - sur le plateau ${ouverte + 1}`} className="image-modal__image" />
            <button className="image-modal__nav image-modal__nav--prev" onClick={() => aller(ouverte - 1)} aria-label="Photo précédente">‹</button>
            <button className="image-modal__nav image-modal__nav--next" onClick={() => aller(ouverte + 1)} aria-label="Photo suivante">›</button>
            <div className="image-modal__counter" aria-live="polite">{ouverte + 1} / {photos.length}</div>
          </div>
        </div>
      )}
    </>
  );
};

// Grille de courtes vidéos muettes en boucle (la première en grand). Chaque
// vidéo ne se charge et ne joue que lorsqu'elle est visible à l'écran.
const ExtraitVideo = ({ src }) => {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.25 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video ref={ref} poster={`${src}.jpg`} preload="none" muted loop playsInline>
      <source src={`${src}.mp4`} type="video/mp4" />
    </video>
  );
};

const ExtraitsGrille = ({ extraits, ratio }) => {
  const { videos, credit, creditLien, lien } = extraits;
  // La première en grand ; si le reste est impair, la dernière aussi (pas de trou)
  const classes = ['film-detail__extraits-grid', videos.length % 2 === 0 ? 'film-detail__extraits-grid--fin-large' : ''].join(' ');
  return (
    <>
      <div className={classes} style={ratio ? { '--ratio-extrait': ratio } : undefined}>
        {videos.map((src) => (
          <ExtraitVideo key={src} src={src} />
        ))}
      </div>
      {(credit || lien) && (
        <p className="film-detail__extraits-credit">
          {credit && (
            <>
              Images :{' '}
              <a href={creditLien} target="_blank" rel="noopener noreferrer">{credit}</a>
              {lien && ' · '}
            </>
          )}
          {lien && (
            <a href={lien} target="_blank" rel="noopener noreferrer">{extraits.lienTexte || 'Voir le post Instagram'} →</a>
          )}
        </p>
      )}
    </>
  );
};

// Libellés des informations techniques
const LIBELLES_SPECS = {
  format: 'Format',
  duree: 'Durée',
  jours: 'Jours de tournage',
  tournage: 'Tournage',
  annee: 'Année',
  pays: 'Pays',
  location: 'Location',
  coproduction: 'Coproduction',
  cadrage: 'Cadrage',
  budget: 'Budget',
  lieu: 'Lieu',
  camera: 'Caméra',
  objectifs: 'Objectifs',
  optiques: 'Optiques',
  particularite: 'Particularité',
  diffusion: 'Diffusion',
  lumiere: 'Lumière',
};

// Libellés des postes, dans l'ordre d'affichage
const LIBELLES_EQUIPE = {
    artiste: "Artiste",
    realisateur: "Réalisation",
    realisateurs: "Réalisation",
    realisatrice: "Réalisation",
    realisatrices: "Réalisation",
    scenariste: "Scénario",
    dirProd: "Direction de production",
    producteur: "Producteur",
    chargeeProd: "Chargée de production",
    coordProd: "Coordination de production",
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
    pupitreur: "Pupitreur",
    chefElectro: "Chef électricien",
    cheffeElectro: "Cheffe électricienne",
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
    stylisme: "Stylisme",
    assistantStylisme: "Assistant stylisme",
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
  };

// Postes montrés d'emblée ; le reste de l'équipe est replié
const POSTES_CLES = [
  'artiste', 'realisateur', 'realisateurs', 'realisatrice', 'realisatrices',
  'chefOp', 'cheffeOp', 'coChefOp', 'chefElectro', 'cheffeElectro', 'chefMachino', 'cheffeMachino',
];

const Equipe = ({ project }) => {
  const [ouverte, setOuverte] = useState(false);
  const postes = Object.entries(LIBELLES_EQUIPE).filter(([key]) => project[key]);
  if (postes.length === 0) return null;

  const cles = postes.filter(([key]) => POSTES_CLES.includes(key));
  const visibles = ouverte || postes.length <= 8 || cles.length === 0 ? postes : cles;
  const caches = postes.length - visibles.length;

  return (
    <div className="film-detail__team">
      <h3>Équipe</h3>
      <ul>
        {visibles.map(([key, label]) => (
          <li key={key}>
            <strong>{label}</strong>
            <span>{project[key]}</span>
          </li>
        ))}
      </ul>
      {caches > 0 && (
        <button type="button" className="film-detail__plus" onClick={() => setOuverte(true)}>
          Toute l'équipe (+{caches})
        </button>
      )}
    </div>
  );
};

export default FilmDetail;