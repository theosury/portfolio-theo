import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project, onClick }) => {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card__image-wrapper">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="project-card__image"
          loading="lazy"
        />
        <div className="project-card__overlay"></div>
        
        <div className="project-card__content">
          {project.artiste && (
            <p className="project-card__artiste">{project.artiste}</p>
          )}
          <h3 className="project-card__title">{project.title}</h3>
          
          <div className="project-card__meta">
            {/* Ligne : Année • Rôle • Statut (si présent) */}
            <span className="project-card__year">{project.year}</span>
            <span className="project-card__separator">•</span>
            <span className="project-card__role">{project.role}</span>
            
            {project.status && (
              <>
                <span className="project-card__separator">•</span>
                <span className="project-card__status" data-status={project.status}>{project.status}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;