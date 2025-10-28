import React, { useState } from 'react';
import { projectsData } from '../../data/projectsData';
import ProjectCard from '../ProjectCard/ProjectCard';
import ProjectModal from '../ProjectModal/ProjectModal';
import './Photos.css';

const Photos = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <section className="photos section" id="photos">
      <div className="container">
        <div className="photos__header">
          <h2 className="photos__title">Photographie</h2>
          <p className="photos__subtitle">
            Séries photographiques et travaux personnels
          </p>
        </div>

        <div className="photos__grid">
          {projectsData.photos.map((photo) => (
            <ProjectCard
              key={photo.id}
              project={photo}
              onClick={() => handleProjectClick(photo)}
            />
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};

export default Photos;
