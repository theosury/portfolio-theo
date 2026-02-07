import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsData } from '../data/projectsData';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import './Films.css';

const Films = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Films — Théo Sury';
  }, []);

  const handleProjectClick = (project) => {
    navigate(`/films/${project.id}`);
  };

  return (
    <div className="films-page">
      <div className="films-container">
        <header className="page-header-unified">
          <h2 className="page-title-unified">Films</h2>
        </header>

        <div className="films-grid">
          {projectsData.films.map((film) => (
            <ProjectCard
              key={film.id}
              project={film}
              onClick={() => handleProjectClick(film)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Films;