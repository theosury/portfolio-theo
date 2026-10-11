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


        {/* Les autres tournages en mosaïque de tuiles : on voit d'un coup d'œil
            qu'il y en a beaucoup, et lesquels sont en cours, sans couper le défilement */}
        {filmsSecondaires.length > 0 && (
          <section className="films-autres">
            <header className="films-autres__resume">
              <p className="films-autres__compte">
                + {filmsSecondaires.length} autres tournages, en fiction, documentaire et VR
              </p>
              {/* Simple mention : le statut exact est sur chaque fiche */}
              {filmsSecondaires.filter((f) => f.status).length > filmsSecondaires.length / 2 && (
                <p className="films-autres__statuts">La plupart en post-production</p>
              )}
            </header>
            <ul className="films-tuiles">
              {filmsSecondaires.map((film) => (
                <li key={film.id}>
                  <button type="button" className="films-tuile" onClick={() => handleProjectClick(film)}>
                    {film.specs?.format && <span className="films-tuile__type">{film.specs.format}</span>}
                    <span className="films-tuile__titre">
                      {film.artiste ? `${film.artiste} : ${film.title}` : film.title}
                    </span>
                    <span className="films-tuile__role">{film.role}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default Films;
