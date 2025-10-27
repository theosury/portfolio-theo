import React, { useEffect, useState } from 'react';
import './ProjectModal.css';

const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Empêcher le scroll du body quand la modal est ouverte
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleNextImage = () => {
    if (project.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (project.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="project-modal" onClick={onClose}>
      <div className="project-modal__content" onClick={(e) => e.stopPropagation()}>
        {/* Bouton fermer */}
        <button className="project-modal__close" onClick={onClose}>
          ✕
        </button>

        {/* Galerie d'images */}
        {project.images && project.images.length > 0 && (
          <div className="project-modal__gallery">
            <img 
              src={project.images[currentImageIndex]}
              alt={`${project.title} - Image ${currentImageIndex + 1}`}
              className="project-modal__image"
            />
            
            {project.images.length > 1 && (
              <>
                <button 
                  className="project-modal__arrow project-modal__arrow--left"
                  onClick={handlePrevImage}
                >
                  ‹
                </button>
                <button 
                  className="project-modal__arrow project-modal__arrow--right"
                  onClick={handleNextImage}
                >
                  ›
                </button>
                
                <div className="project-modal__image-counter">
                  {currentImageIndex + 1} / {project.images.length}
                </div>
              </>
            )}
          </div>
        )}

        {/* Informations du projet */}
        <div className="project-modal__info">
          <h2 className="project-modal__title">{project.title}</h2>
          
          <div className="project-modal__meta">
            <span>{project.year}</span>
            {project.school && (
              <>
                <span className="project-modal__separator">•</span>
                <span>{project.school}</span>
              </>
            )}
            {project.category && (
              <>
                <span className="project-modal__separator">•</span>
                <span>{project.category}</span>
              </>
            )}
          </div>

          {project.role && (
            <p className="project-modal__role">
              <strong>Rôle :</strong> {project.role}
            </p>
          )}

          {project.director && (
            <p className="project-modal__director">
              <strong>Réalisateur :</strong> {project.director}
            </p>
          )}

          {project.description && (
            <p className="project-modal__description">
              {project.description}
            </p>
          )}

          {/* Specs techniques */}
          {project.specs && (
            <div className="project-modal__specs">
              <h3>Informations techniques</h3>
              <ul>
                {project.specs.format && (
                  <li><strong>Format :</strong> {project.specs.format}</li>
                )}
                {project.specs.camera && (
                  <li><strong>Caméra :</strong> {project.specs.camera}</li>
                )}
                {project.specs.objectifs && (
                  <li><strong>Objectifs :</strong> {project.specs.objectifs}</li>
                )}
              </ul>
            </div>
          )}

          {/* Lien Vimeo si disponible */}
          {project.vimeoLink && (
            <a 
              href={project.vimeoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="project-modal__link btn btn-primary"
            >
              Voir sur Vimeo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
