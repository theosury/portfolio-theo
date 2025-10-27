import React from 'react';
import { projectsData } from '../../data/projectsData';
import './ProjectsInProgress.css';

const ProjectsInProgress = () => {
  return (
    <section className="projects-in-progress section" id="in-progress">
      <div className="container">
        <div className="projects-in-progress__header">
          <h2 className="projects-in-progress__title">Projets en post-production</h2>
          <p className="projects-in-progress__subtitle">
            Bientôt disponibles
          </p>
        </div>

        <div className="projects-in-progress__grid">
          {projectsData.projectsInProgress.map((project) => (
            <div key={project.id} className="progress-project">
              <h3 className="progress-project__title">{project.title}</h3>
              <div className="progress-project__meta">
                <span className="progress-project__year">{project.year}</span>
                <span className="progress-project__separator">•</span>
                <span className="progress-project__role">{project.role}</span>
              </div>
              <p className="progress-project__production">{project.production}</p>
              <span className="progress-project__status">{project.status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsInProgress;
