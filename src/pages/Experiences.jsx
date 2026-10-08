import React, { useEffect, useState } from 'react';
import { projectsData } from '../data/projectsData';
import './Experiences.css';

// Du plus récent au plus ancien (dernière année citée, « 2023-2024 » compte pour 2024)
const derniereAnnee = (item) => Math.max(...(String(item.year).match(/\d{4}/g) || [0]).map(Number));
const experiencesTriees = [...projectsData.autres].sort((a, b) => derniereAnnee(b) - derniereAnnee(a));

const Experiences = ({ dansAccueil = false }) => {
  useEffect(() => {
    if (!dansAccueil) document.title = 'Expériences | Théo Sury';
  }, [dansAccueil]);

  return (
    <div className="experiences-page">
      <div className="experiences-container">
        <header className="page-header-unified">
          <h1 className="page-title-unified">Expériences</h1>
          <p className="page-intro">
            Les tournages, les plateaux et les scènes en dehors de mes films.
          </p>
        </header>

        <ul className="experiences-list">
          {experiencesTriees.map((item) => (
            <li key={item.id} className="experiences-item">
              {/* Colonne de gauche : l'année en grand, la durée en dessous */}
              <div className="experiences-quand">
                <span className="experiences-annee">{item.year}</span>
                {item.duree && item.duree !== item.year && (
                  <span className="experiences-date">{item.duree}</span>
                )}
              </div>

              <div className="experiences-corps">
                <div className="experiences-entete">
                  <h3 className="experiences-title">{item.title}</h3>
                  {item.logo && <img className="experiences-logo" src={item.logo} alt="" loading="lazy" />}
                </div>

                <p className="experiences-meta">
                  <span className="experiences-role">{item.role}</span>
                  {item.production && item.production !== item.title && (
                    <>
                      <span className="experiences-sep">·</span>
                      <span className="experiences-prod">{item.production}</span>
                    </>
                  )}
                </p>

                {item.description && (
                  <p className="experiences-desc">{item.description}</p>
                )}

                {item.photos && <PhotosExperience photos={item.photos} titre={item.title} />}

                {/* Making-of en vidéo (lecture au clic), avec le clip en lien */}
                {item.makingOf && (
                  <div className="experiences-making">
                    {item.makingOf.map((m) => (
                      <figure key={m.file}>
                        <video src={`${m.file}#t=1`} controls playsInline preload="metadata" />
                        <figcaption>
                          <span>{m.title}</span>
                          {m.clip && (
                            <a href={`https://www.youtube.com/watch?v=${m.clip}`} target="_blank" rel="noopener noreferrer">
                              Voir le clip →
                            </a>
                          )}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}

                {(item.realisateurs || item.directeursPhoto) && (
                  <p className="experiences-credits">
                    {item.realisateurs && <>Réalisation : {item.realisateurs}. </>}
                    {item.directeursPhoto && <>Direction photo : {item.directeursPhoto}.</>}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Nombre de colonnes qui remplit toutes les rangées (4 → 4, 6 → 3, 12 → 4…)
const colonnesSansTrou = (n) => [4, 3, 2].find((c) => n % c === 0) || 4;
// Si le compte ne tombe pas juste, la première photo passe en grand (2×2) pour combler
const premiereEnGrand = (n) => ![4, 3, 2].some((c) => n % c === 0) && (n + 3) % 4 === 0;

// Petite mosaïque de photos ; au clic, la photo s'ouvre en grand (flèches, Échap)
const PhotosExperience = ({ photos, titre }) => {
  const [ouverte, setOuverte] = useState(null);
  const aller = (i) => setOuverte((i + photos.length) % photos.length);

  useEffect(() => {
    if (ouverte === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOuverte(null);
      if (e.key === 'ArrowRight') aller(ouverte + 1);
      if (e.key === 'ArrowLeft') aller(ouverte - 1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [ouverte]);

  return (
    <>
      <div className={`experiences-photos${premiereEnGrand(photos.length) ? ' experiences-photos--grande' : ''}`} style={{ '--colonnes': colonnesSansTrou(photos.length) }}>
        {photos.map((src, i) => (
          <button key={src} type="button" onClick={() => setOuverte(i)} aria-label={`Agrandir la photo ${i + 1}`}>
            <img src={`${src}-vignette.jpg`} alt={`${titre} - photo ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {ouverte !== null && (
        <div className="experiences-visionneuse" role="dialog" aria-label="Photo en grand" onClick={() => setOuverte(null)}>
          <img src={`${photos[ouverte]}.jpg`} alt={`${titre} - photo ${ouverte + 1}`} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="experiences-visionneuse__nav prec" onClick={(e) => { e.stopPropagation(); aller(ouverte - 1); }} aria-label="Photo précédente">‹</button>
          <button type="button" className="experiences-visionneuse__nav suiv" onClick={(e) => { e.stopPropagation(); aller(ouverte + 1); }} aria-label="Photo suivante">›</button>
          <button type="button" className="experiences-visionneuse__fermer" onClick={() => setOuverte(null)} aria-label="Fermer">×</button>
        </div>
      )}
    </>
  );
};

export default Experiences;
