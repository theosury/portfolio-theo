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
        <div className="project-card__overlay">
          <span className="project-card__view-more">Voir le projet</span>
        </div>
      </div>
      
      <div className="project-card__content">
        <h3 className="project-card__title">{project.title}</h3>
        <div className="project-card__meta">
          <span className="project-card__year">{project.year}</span>
          {project.school && (
            <>
              <span className="project-card__separator">•</span>
              <span className="project-card__school">{project.school}</span>
            </>
          )}
          {project.category && (
            <>
              <span className="project-card__separator">•</span>
              <span className="project-card__category">{project.category}</span>
            </>
          )}
        </div>
        {project.role && (
          <p className="project-card__role">{project.role}</p>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
