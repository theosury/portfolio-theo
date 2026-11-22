import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsData, projetsSecondaires } from '../data/projectsData';
import Defile from '../components/Defile/Defile';
import './Films.css';

const estSecondaire = (film) => projetsSecondaires.includes(film.id);

// Film visible en ligne (YouTube, Vimeo ou fichier) : sa tuile le montre
const aUnFilm = (film) =>
  Boolean(film.youtubeId || film.vimeoId || film.videoFile || film.youtubeIds?.length || film.vimeoIds?.length || film.videoFiles?.length);

// Image en fond de tuile : film visible, ou couverture demandée sur la fiche (couvertureTuile).
// couvertureTuile peut nommer sa propre image quand la vignette de la fiche est trop sombre sous le voile de la tuile.
const aUneCouverture = (film) => aUnFilm(film) || Boolean(film.couvertureTuile);
const imageDeTuile = (film) => (typeof film.couvertureTuile === 'string' ? film.couvertureTuile : film.thumbnail);


// Essai grand format : une seule suite en trois paliers, choisis par Théo
// selon ce dont il est le plus fier ; la taille dit l'importance. Dans chaque
// palier, l'ordre de la liste. Un film absent des listes va au dernier palier.
// Une dernière rangée incomplète garde la taille des autres et se centre.
const PALIERS = [
  { parLigne: 2, ids: ['vedette', 'asterix', 'vagues', 'ziak-feng-shui', 'casse-cest-casse', 'the-right-choice', 'insipide', 'gate66', 'super-vespapa', 'jugement-dernier', 'aleksandra', 'armanaque', 'jeanne', 'azincourt'] },
  // 14 / 6 / 16 : rangées pleines à chaque palier ; La vente aux souvenirs et Azincourt montés (Théo, 2026-11-22)
  { parLigne: 3, ids: ['la-table-regie', 'loverdance', 'darwin-experience', 'bureau-du-karma', 'casse-noisette', 'quand-son-souffle'] },
  // Tecnomat, Mode Kids, Pardon et DNA descendus ici : moins mis en avant (Théo, 2026-11-22)
  // Le Révolté échangé avec Mâle Addict (Théo, 2026-11-22)
  { parLigne: 4, ids: ['tecnomat', 'mode-kids', 'pardon', 'dna', 'nikon-mamie', 'marcus', 'nothing-personal', 'moutarderie-fallot-vr', 'cache-toi-cest-mon-pere', 'trauma-resonance', 'undetoi', 'bbc', 'verite-studio', 'revolte', 'gadfly', 'male-addict'] },
];

const Films = ({ dansAccueil = false }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!dansAccueil) document.title = 'Films | Théo Sury';
  }, [dansAccueil]);

  const handleProjectClick = (project) => {
    // La croix de la fiche ramènera ici, à cet endroit de la page
    try {
      sessionStorage.setItem('retourAccueil', String(window.scrollY));
      sessionStorage.setItem('retourPage', '/');
    } catch { /* stockage indisponible */ }
    navigate(`/films/${project.id}`);
  };

  const filmsPrincipaux = projectsData.films.filter((film) => !estSecondaire(film));
  const filmsSecondaires = projectsData.films.filter(estSecondaire);

  const bento = document.documentElement.classList.contains('bento');
  if (bento) {
    // Pas de vignette figée : seuls les films avec extraits ou photos de plateau en fondu
    const anime = (f) => Boolean(f.boucles || f.boucle || f.diaporama);
    const principaux = [...filmsPrincipaux.filter((f) => !f.status), ...filmsPrincipaux.filter((f) => f.status)].filter(anime);
    const secondaires = filmsSecondaires.filter(anime);
    const tous = [...principaux, ...secondaires];
    const parId = Object.fromEntries(tous.map((f) => [f.id, f]));
    const places = new Set(PALIERS.flatMap((p) => p.ids));
    const paliers = PALIERS.map((palier, i) => ({
      ...palier,
      films: [
        ...palier.ids.map((id) => parId[id]).filter(Boolean),
        ...(i === PALIERS.length - 1 ? tous.filter((f) => !places.has(f.id)) : []),
      ],
    }));
    return (
      <div className="films-page">
        <header className="page-header-unified">
          <h1 className="page-title-unified">Films</h1>
        </header>
        {paliers.map((palier) => (
          <Defile
            key={palier.parLigne}
            films={palier.films}
            parLigne={palier.films.map(() => palier.parLigne)}
            onOuvrir={handleProjectClick}
          />
        ))}
      </div>
    );
  }

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
          {/* Par trois : des photos de tournage, moins de place que les vrais films (Théo, 22 nov 2026) */}
          <Defile films={filmsPrincipaux.filter((f) => f.status)} onOuvrir={handleProjectClick} parRang={3} />
        </>
      )}

      <div className="films-container">


        {/* Les autres tournages en mosaïque de tuiles : on voit d'un coup d'œil
            qu'il y en a beaucoup, et lesquels sont en cours, sans couper le défilement */}
        {filmsSecondaires.length > 0 && (
          <section className="films-autres">
            <header className="films-autres__resume">
              <p className="films-autres__compte">
                + {filmsSecondaires.length} autres tournages, du court-métrage à la publicité
              </p>
            </header>
            <ul className="films-tuiles">
              {filmsSecondaires.map((film) => (
                <li key={film.id}>
                  <button
                    type="button"
                    className={`films-tuile${aUneCouverture(film) ? ' films-tuile--film' : ''}`}
                    style={aUneCouverture(film) ? { '--fond-tuile': `url("${imageDeTuile(film)}")` } : undefined}
                    onClick={() => handleProjectClick(film)}
                  >
                    {/* Année seule : le format surchargeait la tuile (Théo, 23 nov 2026) */}
                    <span className="films-tuile__haut">
                      <span className="films-tuile__annee">{film.year}</span>
                    </span>
                    <span className="films-tuile__titre">
                      {film.artiste ? `${film.artiste} : ${film.title}` : film.title}
                    </span>
                    <span className="films-tuile__role">{film.role}</span>
                    {aUnFilm(film) && <span className="films-tuile__voir">▶ Voir le film</span>}
                    {!aUnFilm(film) && film.status && <span className="films-tuile__statut">{film.status}</span>}
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
