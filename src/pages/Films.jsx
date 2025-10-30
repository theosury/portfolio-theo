import React from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsData } from '../data/projectsData';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import './Films.css';

const Films = () => {
  const navigate = useNavigate();

  // Films terminés (hero projects + films normaux, déjà triés par date)
  const completedFilms = projectsData.films.filter(
    film => film.status !== 'En post-production'
  );

  // Films en post-production (déjà triés par date)
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
          {/* Grille de tous les films terminés */}
          <div className="films-page__grid">
            {completedFilms.map((film) => (
              <ProjectCard
                key={film.id}
                project={film}
                onClick={() => handleProjectClick(film)}
              />
            ))}
          </div>

          {/* Section post-production si films présents */}
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
