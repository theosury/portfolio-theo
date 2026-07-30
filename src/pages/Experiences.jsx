import React, { useEffect } from 'react';
import { projectsData } from '../data/projectsData';
import './Experiences.css';

const Experiences = () => {
  useEffect(() => {
    document.title = 'Expériences | Théo Sury';
  }, []);

  return (
    <div className="experiences-page">
      <div className="experiences-container">
        <header className="page-header-unified">
          <h2 className="page-title-unified">Expériences</h2>
          <p className="page-intro">
            Les tournages, les plateaux et les scènes en dehors de mes films.
          </p>
        </header>

        <ul className="experiences-list">
          {projectsData.autres.map((item) => (
            <li key={item.id} className="experiences-item">
              <div className="experiences-head">
                <h3 className="experiences-title">{item.title}</h3>
                <span className="experiences-date">
                  {item.duree && item.duree !== item.year
                    ? `${item.duree} · ${item.year}`
                    : item.duree || item.year}
                </span>
              </div>

              <p className="experiences-meta">
                <span className="experiences-role">{item.role}</span>
                {item.production && (
                  <>
                    <span className="experiences-sep">·</span>
                    <span className="experiences-prod">{item.production}</span>
                  </>
                )}
              </p>

              {item.description && (
                <p className="experiences-desc">{item.description}</p>
              )}

              {(item.realisateurs || item.directeursPhoto) && (
                <p className="experiences-credits">
                  {item.realisateurs && <>Réalisation : {item.realisateurs}. </>}
                  {item.directeursPhoto && <>Direction photo : {item.directeursPhoto}.</>}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Experiences;
