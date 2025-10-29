import React, { useState } from 'react';
import { projectsData } from '../../data/projectsData';
import ProjectCard from '../ProjectCard/ProjectCard';
import ProjectModal from '../ProjectModal/ProjectModal';
import './Films.css';

const Films = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <section className="films section" id="films">
      <div className="container">
        <div className="films__header">
          <h2 className="films__title">AUTRES FILMS</h2>
        </div>

        <div className="films__grid">
          {projectsData.films.filter(film => film.status !== 'En post-production').map((film) => (
            <ProjectCard
              key={film.id}
              project={film}
              onClick={() => handleProjectClick(film)}
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

export default Films;
