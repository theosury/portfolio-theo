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
          <h3 className="project-card__title">{project.title}</h3>
          
          <div className="project-card__meta">
            <span className="project-card__month">
              {project.month || project.year}
            </span>
            <span className="project-card__separator">•</span>
            <span className="project-card__role">{project.role}</span>
          </div>
          
          {project.production && (
            <p className="project-card__production">{project.production}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
