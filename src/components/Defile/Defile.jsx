import React, { useEffect, useRef, useState } from 'react';
import './Defile.css';

// Grille vivante : chaque film est une carte avec son extrait en boucle.
// Utilisé sur l'accueil (sélection) et sur la page Films (tous les films).
const Defile = ({ films, onOuvrir }) => (
  <div className="defile">
    {films.map((film) => (
      <BandeFilm key={film.id} film={film} onClick={() => onOuvrir(film)} />
    ))}
  </div>
);

// Format d'une bande : celui du film (« 1920 / 804 »), mais jamais plus haut
// que 1,6:1, pour qu'un film en 4:3 soit légèrement recadré plutôt que bordé de noir
const ratioBande = (ratio) => {
  if (!ratio) return '16 / 9';
  const [l, h] = ratio.split('/').map(Number);
  return String(Math.max(l / h, 1.6));
};

// Image créditée à son chef-opérateur dès que Théo ne l'a pas signée lui-même
// (électro, assistant, régie, mais aussi réalisation ou cadre)
const creditImage = (film) => {
  if (/chef-op/i.test(film.role)) return null;
  const nom = film.chefOp || film.cheffeOp || null;
  return nom && !/sury/i.test(nom) ? nom : null;
};

// Réalisation : créditée sauf quand c'est Théo lui-même
const creditReal = (film) => {
  const nom = film.realisateur || film.realisateurs || film.realisatrice || film.realisatrices;
  return nom && !/sury/i.test(nom) ? nom : null;
};

const credits = (film) =>
  [creditReal(film) && `Réal : ${creditReal(film)}`, creditImage(film) && `Image : ${creditImage(film)}`]
    .filter(Boolean)
    .join(' · ');

// Une bande du défilé. L'extrait ne se charge et ne joue que lorsque la bande
// est à l'écran. Sans extrait (films en post-production, ou vidéo indisponible),
// l'image de la vignette avance en lent zoom pour garder du mouvement.
const BandeFilm = ({ film, onClick }) => {
  // Plusieurs extraits enchaînés ; l'ancien champ « boucle » (un seul) reste accepté
  const extraits = film.boucles || (film.boucle ? [film.boucle] : null);

  return (
    <button
      type="button"
      className={`defile__bande${extraits ? ' defile__bande--video' : ''}`}
      style={{ '--ratio-bande': film.diaporamaRatio || ratioBande(film.boucleRatio) }}
      onClick={onClick}
    >
      <div className="defile__media">
        {extraits ? (
          <Extraits sources={extraits} />
        ) : film.diaporama ? (
          <Diaporama images={film.diaporama} />
        ) : (
          <img className="defile__zoom" src={film.thumbnail} alt="" loading="lazy" />
        )}
      </div>
      <div className="defile__texte">
        {film.artiste && <span className="defile__artiste">{film.artiste}</span>}
        <span className="defile__nom">{film.title}</span>
        <span className="defile__meta">
          {film.year} · {film.role}
          {film.status && <em className="defile__statut">{film.status}</em>}
        </span>
        {credits(film) && <span className="defile__credits">{credits(film)}</span>}
      </div>
      <span className="defile__voir" aria-hidden="true">Voir le projet →</span>
    </button>
  );
};

// Enchaînement d'extraits muets : un seul est décodé à la fois (l'actif ;
// le suivant est seulement préchargé), fondu enchaîné sur la dernière
// demi-seconde, et tout est en pause tant que la carte n'est pas à l'écran.
// Coupe franche entre les plans (pas de fondu), juste avant la fin du plan actif
const FONDU = 0.05;

const Extraits = ({ sources }) => {
  const conteneur = useRef(null);
  const videos = useRef([]);
  const [actif, setActif] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = conteneur.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === actif && visible) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [actif, visible]);

  const suivant = () => {
    if (sources.length < 2) return;
    const prochain = (actif + 1) % sources.length;
    const video = videos.current[prochain];
    if (video) video.currentTime = 0;
    setActif(prochain);
  };

  // Démarre le plan suivant juste avant la fin du plan actif, pour le fondu
  const surTemps = (e) => {
    const v = e.currentTarget;
    if (v.duration && v.duration - v.currentTime <= FONDU) suivant();
  };

  return (
    <div ref={conteneur} className="defile__extraits" style={{ position: 'absolute', inset: 0 }}>
      {sources.map((src, i) => {
        const proche = i === actif || i === (actif + 1) % sources.length;
        return (
          <video
            key={src}
            ref={(el) => { videos.current[i] = el; }}
            className={i === actif ? 'actif' : ''}
            poster={i === 0 ? `${src}.jpg` : undefined}
            preload={visible && proche ? 'auto' : 'none'}
            muted
            playsInline
            loop={sources.length === 1}
            onTimeUpdate={i === actif ? surTemps : undefined}
            onEnded={i === actif ? suivant : undefined}
            style={{
              opacity: i === actif ? 1 : 0,
              transition: 'transform 1.2s cubic-bezier(0.2, 0.7, 0.2, 1)',
            }}
          >
            <source src={`${src}.mp4`} type="video/mp4" />
          </video>
        );
      })}
    </div>
  );
};

// Fondu enchaîné entre quelques photos, chacune en lent zoom
const Diaporama = ({ images }) => {
  const [actif, setActif] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActif((i) => (i + 1) % images.length), 2400);
    return () => clearInterval(timer);
  }, [images.length]);

  return images.map((src, i) => (
    <img
      key={src}
      className={`defile__diapo${i === actif ? ' actif' : ''}`}
      src={src}
      alt=""
      loading="lazy"
    />
  ));
};

export default Defile;
