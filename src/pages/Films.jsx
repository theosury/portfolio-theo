import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsData, projetsSecondaires } from '../data/projectsData';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import './Films.css';

const estSecondaire = (film) => projetsSecondaires.includes(film.id);

const Films = () => {
  const navigate = useNavigate();
  const [montrerEnCours, setMontrerEnCours] = useState(false);

  useEffect(() => {
    document.title = 'Films | Théo Sury';
  }, []);

  const handleProjectClick = (project) => {
    navigate(`/films/${project.id}`);
  };

  const filmsPrincipaux = projectsData.films.filter((film) => !estSecondaire(film));
  const filmsSecondaires = projectsData.films.filter(estSecondaire);

  const renderGrille = (films) => (
    <div className="films-grid">
      {films.map((film) => (
        <ProjectCard
          key={film.id}
          project={film}
          onClick={() => handleProjectClick(film)}
        />
      ))}
    </div>
  );

  // Les projets de second plan sont listés, pas exposés en cartes
  const renderListe = (films) => (
    <ul className="films-list">
      {films.map((film) => (
        <li key={film.id}>
          <button
            type="button"
            className="films-list__row"
            onClick={() => handleProjectClick(film)}
          >
            <span className="films-list__title">
              {film.artiste ? `${film.artiste} : ${film.title}` : film.title}
            </span>
            <span className="films-list__type">{film.specs?.format || ''}</span>
            <span className="films-list__date">{film.month || film.year}</span>
            <span className="films-list__role">{film.role}</span>
            <span className="films-list__status" data-status={film.status}>{film.status || ''}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="films-page">
      <div className="films-container">
        <header className="page-header-unified">
          <h2 className="page-title-unified">Films</h2>
        </header>

        {renderGrille(filmsPrincipaux)}

        {filmsSecondaires.length > 0 && (
          <div className="films-encours">
            <button
              type="button"
              className="films-encours__toggle"
              onClick={() => setMontrerEnCours((v) => !v)}
              aria-expanded={montrerEnCours}
            >
              {montrerEnCours
                ? 'Masquer les autres projets'
                : `Voir les ${filmsSecondaires.length} autres projets`}
            </button>

            {montrerEnCours && renderListe(filmsSecondaires)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Films;
