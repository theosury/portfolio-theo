import React from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsData } from '../data/projectsData';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import './Films.css';

const Films = () => {
  const navigate = useNavigate();

  // Films terminés
  const completedFilms = projectsData.films.filter(
    film => film.status !== 'En post-production'
  );

  // Films en post-production
  const filmsInProgress = projectsData.films.filter(
    film => film.status === 'En post-production'
  );

  const handleProjectClick = (project) => {
    navigate(`/films/${project.id}`);
  };

  return (
    <div className="films-page">
      <section className="films-page__section">
        <div className="container">
          {/* Header simple et élégant */}
          <div className="films-page__header">
            <h1 className="films-page__title">Filmographie</h1>
            <p className="films-page__subtitle">Courts & moyens-métrages de fiction</p>
          </div>

          {/* Grille de films */}
          <div className="films-page__grid">
            {completedFilms.map((film) => (
              <ProjectCard
                key={film.id}
                project={film}
                onClick={() => handleProjectClick(film)}
              />
            ))}
          </div>

          {/* Section post-production */}
          {filmsInProgress.length > 0 && (
            <>
              <div className="films-page__separator"></div>
              
              <div className="films-page__postprod-header">
                <h2 className="films-page__postprod-title">En post-production</h2>
                <p className="films-page__postprod-subtitle">
                  Projets actuellement en montage ou étalonnage
                </p>
              </div>

              <div className="films-page__grid films-page__grid--postprod">
                {filmsInProgress.map((film) => (
                  <ProjectCard
                    key={film.id}
                    project={film}
                    onClick={() => handleProjectClick(film)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Films;