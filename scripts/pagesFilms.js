// =============================================
// PAGES DES FILMS ET SITEMAP À LA COMPILATION
// =============================================
// Après `vite build`, crée dist/films/<id>/index.html pour chaque film visible,
// avec son titre, sa description et sa vignette dans les balises de partage :
// WhatsApp, Instagram, iMessage ou LinkedIn affichent alors le bon film quand
// on envoie le lien d'une fiche. Le site lui-même ne change pas : React prend
// le relais comme sur l'accueil.
// Régénère aussi dist/sitemap.xml à partir de projectsData.js, pour qu'un film
// caché (masque: true) en sorte et qu'un nouveau film y entre automatiquement.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SITE = 'https://theosury.fr';
const IMAGE_PAR_DEFAUT = '/og-cover.jpg';

const echapper = (texte) =>
  String(texte)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Une phrase courte pour l'aperçu : coupée proprement vers 200 caractères
const resumer = (texte, max = 200) => {
  const propre = String(texte || '').replace(/\s+/g, ' ').trim();
  if (propre.length <= max) return propre;
  const coupe = propre.slice(0, max);
  return `${coupe.slice(0, coupe.lastIndexOf(' '))}…`;
};

// Version légère (1200 px, < 250 Ko) dans public/images/partage/<id>.jpg si elle existe :
// WhatsApp n'affiche souvent pas d'aperçu au-delà d'environ 300 Ko.
// Pour un nouveau film : sips -s format jpeg -s formatOptions 70 --resampleWidth 1200 <vignette> --out public/images/partage/<id>.jpg
const imageDuFilm = (film, dossierPublic) => {
  const legere = `/images/partage/${film.id}.jpg`;
  if (fs.existsSync(path.join(dossierPublic, legere))) return legere;
  if (film.thumbnail && !film.thumbnail.includes('placeholder')) return film.thumbnail;
  return film.plateau?.photos?.[0] || IMAGE_PAR_DEFAUT;
};

const descriptionDuFilm = (film) => {
  const role = film.role ? `${film.role} — ` : '';
  const texte = resumer(film.description || film.synopsis);
  return texte ? `${role}${texte}` : `${film.role || 'Film'} (${film.year}), portfolio de Théo Sury.`;
};

// Remplace le contenu d'une balise <meta> repérée par son attribut name/property
const remplacerMeta = (html, attribut, nom, valeur) =>
  html.replace(
    new RegExp(`(<meta ${attribut}="${nom}" content=")[^"]*(")`),
    `$1${echapper(valeur)}$2`
  );

const pageDuFilm = (modele, film, dossierPublic) => {
  // Avec la barre finale : Netlify redirige /films/<id> vers /films/<id>/
  const url = `${SITE}/films/${film.id}/`;
  const titre = `${film.title} | Théo Sury`;
  const description = descriptionDuFilm(film);
  const image = `${SITE}${encodeURI(imageDuFilm(film, dossierPublic))}`;

  let html = modele
    .replace(/<title>[^<]*<\/title>/, `<title>${echapper(titre)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    // Les dimensions annoncées sont celles de og-cover.jpg, pas des vignettes
    .replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, '');

  html = remplacerMeta(html, 'name', 'description', description);
  html = remplacerMeta(html, 'property', 'og:type', 'video.other');
  html = remplacerMeta(html, 'property', 'og:url', url);
  html = remplacerMeta(html, 'property', 'og:title', film.title);
  html = remplacerMeta(html, 'property', 'og:description', description);
  html = remplacerMeta(html, 'property', 'og:image', image);
  html = remplacerMeta(html, 'name', 'twitter:title', film.title);
  html = remplacerMeta(html, 'name', 'twitter:description', description);
  html = remplacerMeta(html, 'name', 'twitter:image', image);
  return html;
};

const sitemap = (films) => {
  const urls = [`${SITE}/`, ...films.map((film) => `${SITE}/films/${film.id}/`)];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`;
};

export default function pagesFilms() {
  let dossierSortie = 'dist';
  let racine = process.cwd();
  return {
    name: 'pages-films',
    apply: 'build',
    configResolved(config) {
      racine = config.root;
      dossierSortie = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      // Chemin absolu : vite.config.js est empaqueté, un chemin relatif ne serait plus résolu
      const donnees = pathToFileURL(path.join(racine, 'src/data/projectsData.js')).href;
      const { projectsData } = await import(/* @vite-ignore */ donnees);
      const films = projectsData.films; // déjà sans les films masqués
      const modele = fs.readFileSync(path.join(dossierSortie, 'index.html'), 'utf8');

      for (const film of films) {
        const dossier = path.join(dossierSortie, 'films', film.id);
        fs.mkdirSync(dossier, { recursive: true });
        fs.writeFileSync(path.join(dossier, 'index.html'), pageDuFilm(modele, film, path.join(racine, 'public')));
      }
      fs.writeFileSync(path.join(dossierSortie, 'sitemap.xml'), sitemap(films));
      console.log(`pages-films : ${films.length} fiches et sitemap.xml générés`);
    },
  };
}
