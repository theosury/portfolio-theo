import React, { useState } from 'react';
import { projectsData } from '../../data/projectsData';
import ProjectCard from '../ProjectCard/ProjectCard';
import ProjectModal from '../ProjectModal/ProjectModal';
import './ProjectsInProgress.css';

const ProjectsInProgress = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  // Filtrer uniquement les projets avec status "En post-production"
  const projectsInProgress = projectsData.films.filter(
    project => project.status === 'En post-production'
  );

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <section className="projects-in-progress section" id="projets-en-cours">
      <div className="container">
        <div className="projects-in-progress__header">
          <h2 className="projects-in-progress__title">PROJETS EN POST-PROD</h2>
          <p className="projects-in-progress__subtitle">
            films actuellement en montage ou étalonnage
          </p>
        </div>

        <div className="projects-in-progress__grid">
          {projectsInProgress.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      </div>

      {/* Modal pour afficher le projet en détail */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};

export default ProjectsInProgress;
