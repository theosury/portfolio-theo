import React, { useEffect, useRef, useState } from 'react';
import { projectsData } from '../data/projectsData';
import './Experiences.css';

// Du plus récent au plus ancien (dernière année citée, « 2023-2024 » compte pour 2024)
const derniereAnnee = (item) => Math.max(...(String(item.year).match(/\d{4}/g) || [0]).map(Number));
const experiencesTriees = [...projectsData.autres].sort((a, b) => derniereAnnee(b) - derniereAnnee(a));

// Grille à deux colonnes sans trou : les making-of prennent toute la largeur,
// et une carte restée seule sur sa rangée s'élargit aussi.
const avecLargeur = (items) => {
  const resultat = [];
  let enAttente = null;
  items.forEach((item) => {
    if (item.makingOf) {
      if (enAttente) { resultat.push({ item: enAttente, large: true }); enAttente = null; }
      resultat.push({ item, large: true });
    } else if (enAttente) {
      resultat.push({ item: enAttente, large: false }, { item, large: false });
      enAttente = null;
    } else {
      enAttente = item;
    }
  });
  if (enAttente) resultat.push({ item: enAttente, large: true });
  return resultat;
};

const Experiences = ({ dansAccueil = false }) => {
  // Visionneuse partagée : { medias, index }
  const [vue, setVue] = useState(null);

  useEffect(() => {
    if (!dansAccueil) document.title = 'Expériences | Théo Sury';
  }, [dansAccueil]);

  return (
    <div className="experiences-page">
      <header className="page-header-unified">
        <h1 className="page-title-unified">Expériences</h1>
        <p className="page-intro">
          Les tournages, les plateaux et les scènes en dehors de mes films.
        </p>
      </header>

      <div className="experiences-grille">
        {avecLargeur(experiencesTriees).map(({ item, large }) => (
          <article key={item.id} className={`experience${large ? ' experience--large' : ''}`}>
            {item.makingOf ? (
              <MakingOf item={item} onOuvrir={(index) => setVue({ medias: item.makingOf.map((m) => ({ video: m.file })), index })} />
            ) : item.photos ? (
              <Couverture item={item} onOuvrir={(index) => setVue({ medias: item.photos.map((src) => ({ image: `${src}.jpg` })), index })} />
            ) : null}

            <div className="experience__texte">
              <p className="experience__meta">
                <span>{item.year}</span>
                <span>{item.role}</span>
                {item.production && item.production !== item.title && <span>{item.production}</span>}
              </p>
              <h3 className="experience__titre">{item.title}</h3>
              {item.description && <p className="experience__desc">{item.description}</p>}
              {(item.realisateurs || item.directeursPhoto) && (
                <p className="experience__credits">
                  {item.realisateurs && <>Réal : {item.realisateurs}</>}
                  {item.realisateurs && item.directeursPhoto && ' · '}
                  {item.directeursPhoto && <>Image : {item.directeursPhoto}</>}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      {vue && <Visionneuse {...vue} onFermer={() => setVue(null)} />}
    </div>
  );
};

// Une grande photo par expérience ; au clic, toutes les photos en plein écran
const Couverture = ({ item, onOuvrir }) => {
  const index = Math.max(0, (item.couverture || 1) - 1);
  return (
    <button type="button" className="experience__visuel" onClick={() => onOuvrir(index)} aria-label={`Voir les photos : ${item.title}`}>
      <img src={`${item.photos[index]}.jpg`} alt="" loading="lazy" />
      {item.logo && <img className="experience__logo" src={item.logo} alt="" loading="lazy" />}
      {item.photos.length > 1 && <span className="experience__compte">{item.photos.length} photos</span>}
    </button>
  );
};

// Making-of : de courtes boucles muettes ; au clic, le making-of complet
const MakingOf = ({ item, onOuvrir }) => (
  <div className="experience__making">
    {item.makingOf.map((m, i) => (
      <figure key={m.file}>
        <button type="button" onClick={() => onOuvrir(i)} aria-label={`Voir le making-of : ${m.title}`}>
          <Boucle src={m.boucle} />
        </button>
        <figcaption>
          <span>{m.title}</span>
          {m.clip && (
            <a href={`https://www.youtube.com/watch?v=${m.clip}`} target="_blank" rel="noopener noreferrer">Clip →</a>
          )}
        </figcaption>
      </figure>
    ))}
  </div>
);

// Vidéo muette qui ne joue que lorsqu'elle est visible
const Boucle = ({ src }) => {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.25 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return (
    <video ref={ref} poster={`${src}.jpg`} preload="none" muted loop playsInline>
      <source src={`${src}.mp4`} type="video/mp4" />
    </video>
  );
};

// Plein écran : photos ou vidéos, flèches et Échap au clavier
const Visionneuse = ({ medias, index, onFermer }) => {
  const [i, setI] = useState(index);
  const aller = (n) => setI((n + medias.length) % medias.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onFermer();
      if (e.key === 'ArrowRight') aller(i + 1);
      if (e.key === 'ArrowLeft') aller(i - 1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [i]);

  const media = medias[i];
  return (
    <div className="experiences-visionneuse" role="dialog" aria-label="Plein écran" onClick={onFermer}>
      {media.video ? (
        <video key={media.video} src={media.video} controls autoPlay playsInline onClick={(e) => e.stopPropagation()} />
      ) : (
        <img src={media.image} alt="" onClick={(e) => e.stopPropagation()} />
      )}
      {medias.length > 1 && (
        <>
          <button type="button" className="experiences-visionneuse__nav prec" onClick={(e) => { e.stopPropagation(); aller(i - 1); }} aria-label="Précédent">‹</button>
          <button type="button" className="experiences-visionneuse__nav suiv" onClick={(e) => { e.stopPropagation(); aller(i + 1); }} aria-label="Suivant">›</button>
          <span className="experiences-visionneuse__compteur">{i + 1} / {medias.length}</span>
        </>
      )}
      <button type="button" className="experiences-visionneuse__fermer" onClick={onFermer} aria-label="Fermer">×</button>
    </div>
  );
};

export default Experiences;
