import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsData } from '../../data/projectsData';
import './HeroProjects.css';

const YouTubeLite = ({ videoId, title }) => {
  const [playing, setPlaying] = useState(false);
  const [preconnected, setPreconnected] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&vq=hd1080&autoplay=1`;

  const warmConnection = () => {
    if (preconnected) return;
    setPreconnected(true);
  };

  if (playing) {
    return (
      <div className="hero-project__video">
        <iframe
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="hero-project__iframe"
        ></iframe>
      </div>
    );
  }

  return (
    <>
      {preconnected && (
        <>
          <link rel="preconnect" href="https://www.youtube.com" />
          <link rel="preconnect" href="https://www.google.com" />
          <link rel="preconnect" href="https://static.doubleclick.net" />
        </>
      )}
      <div
        className="hero-project__video hero-project__video--thumbnail"
        onClick={() => setPlaying(true)}
        onPointerOver={warmConnection}
        onFocus={warmConnection}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') setPlaying(true); }}
        aria-label={`Lire ${title}`}
      >
        <img src={thumbnailUrl} alt={title} className="hero-project__thumb" />
        <div className="hero-project__play">
          <svg viewBox="0 0 68 48" width="68" height="48">
            <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#212121" fillOpacity="0.8"/>
            <path d="M45 24L27 14v20" fill="#fff"/>
          </svg>
        </div>
      </div>
    </>
  );
};

const HeroProjects = () => {
  const navigate = useNavigate();

  const handleProjectClick = (project) => {
    navigate(`/films/${project.id}`);
  };

  const handleViewAllProjects = () => {
    navigate('/films');
  };

  return (
    <section className="hero-projects section" id="hero-projects">
      <div className="container">
        <div className="hero-projects__grid">
          {projectsData.heroProjects.map((project) => (
            <div key={project.id} className="hero-project">
              {project.youtubeId ? (
                <YouTubeLite videoId={project.youtubeId} title={project.title} />
              ) : (
                <div className="hero-project__video">
                  <div className="hero-project__placeholder">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="hero-project__thumbnail"
                      loading="lazy"
                    />
                    <div className="hero-project__overlay">
                      <span className="hero-project__coming-soon">Vidéo bientôt disponible</span>
                    </div>
                  </div>
                </div>
              )}

              <div
                className="hero-project__info"
                onClick={() => handleProjectClick(project)}
              >
                <div className="hero-project__info-icon">ℹ</div>
                <h3 className="hero-project__title">{project.title}</h3>
                <div className="hero-project__meta">
                  <span className="hero-project__year">{project.year}</span>
                  <span className="hero-project__separator">•</span>
                  <span className="hero-project__role">{project.role}</span>
                  {project.production && (
                    <>
                      <span className="hero-project__separator">•</span>
                      <span className="hero-project__production">{project.production}</span>
                    </>
                  )}
                </div>
                {project.description && (
                  <p className="hero-project__description">{project.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA pour voir tous les projets */}
        <div className="hero-projects__cta">
          <button onClick={handleViewAllProjects} className="btn btn-primary">
            Voir tous les projets
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroProjects;
