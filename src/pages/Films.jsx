import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsData, projetsSecondaires } from '../data/projectsData';
import Defile from '../components/Defile/Defile';
import './Films.css';

const estSecondaire = (film) => projetsSecondaires.includes(film.id);


const Films = ({ dansAccueil = false }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!dansAccueil) document.title = 'Films | Théo Sury';
  }, [dansAccueil]);

  const handleProjectClick = (project) => {
    // La croix de la fiche ramènera ici, à cet endroit de la page
    try { sessionStorage.setItem('retourAccueil', String(window.scrollY)); } catch { /* stockage indisponible */ }
    navigate(`/films/${project.id}`);
  };

  const filmsPrincipaux = projectsData.films.filter((film) => !estSecondaire(film));
  const filmsSecondaires = projectsData.films.filter(estSecondaire);

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
      <header className="page-header-unified">
        <h1 className="page-title-unified">Films</h1>
      </header>
      {/* Films terminés, dans l'ordre choisi (les plus forts d'abord), puis ceux en cours */}
      <Defile films={filmsPrincipaux.filter((f) => !f.status)} onOuvrir={handleProjectClick} />

      {filmsPrincipaux.some((f) => f.status) && (
        <>
          <header className="page-header-unified films-sous-titre">
            <h2 className="page-title-unified">En cours</h2>
            <p className="page-intro">En post-production.</p>
          </header>
          <Defile films={filmsPrincipaux.filter((f) => f.status)} onOuvrir={handleProjectClick} />
        </>
      )}

      <div className="films-container">


        {/* Tous les autres tournages, toujours visibles : ils montrent le volume de travail */}
        {filmsSecondaires.length > 0 && (
          <section className="films-autres">
            <header className="page-header-unified films-sous-titre">
              <h2 className="page-title-unified">Autres tournages</h2>
              <p className="page-intro">{filmsSecondaires.length} projets, du court-métrage à la publicité.</p>
            </header>
            {renderListe(filmsSecondaires)}
          </section>
        )}
      </div>
    </div>
  );
};

export default Films;
