import React from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsData } from '../../data/projectsData';
import './HeroProjects.css';

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
              <div className="hero-project__video">
                {project.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${project.youtubeId}`}
                    title={project.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="hero-project__iframe"
                  ></iframe>
                ) : (
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
                )}
              </div>
              
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