# Migration vers React Router - Instructions

## ✅ React Router est déjà installé
Tu as déjà `react-router-dom` installé, donc pas besoin de réinstaller.

## 📦 Fichiers à copier dans ton projet

### 1. Remplacer les fichiers existants

**`src/App.jsx`** → Remplace avec le nouveau fichier fourni
**`src/components/Header/Header.jsx`** → Remplace avec le nouveau fichier fourni

### 2. Ajouter les nouveaux fichiers

Copie tout le dossier **`src/pages/`** dans ton projet :
- `src/pages/Home.jsx` + `Home.css`
- `src/pages/Films.jsx` + `Films.css`
- `src/pages/FilmDetail.jsx` + `FilmDetail.css`
- `src/pages/PhotosPage.jsx` + `PhotosPage.css`
- `src/pages/ContactPage.jsx` + `ContactPage.css`

## 🗂️ Structure finale

```
src/
├── App.jsx                    ← MODIFIÉ (React Router)
├── main.jsx                   ← Inchangé
├── components/
│   ├── Header/
│   │   ├── Header.jsx         ← MODIFIÉ (Link au lieu de scroll)
│   │   └── Header.css         ← Inchangé
│   ├── Hero/                  ← Inchangé
│   ├── HeroProjects/          ← Inchangé (sans modal)
│   ├── Films/                 ← Plus utilisé (remplacé par pages/)
│   ├── Photos/                ← Toujours utilisé (avec modal)
│   ├── Contact/               ← Toujours utilisé
│   ├── Footer/                ← Inchangé
│   ├── ProjectCard/           ← Inchangé
│   └── ProjectModal/          ← Plus utilisé pour films
├── pages/                     ← NOUVEAU DOSSIER
│   ├── Home.jsx
│   ├── Home.css
│   ├── Films.jsx
│   ├── Films.css
│   ├── FilmDetail.jsx
│   ├── FilmDetail.css
│   ├── PhotosPage.jsx
│   ├── PhotosPage.css
│   ├── ContactPage.jsx
│   └── ContactPage.css
├── data/
│   └── projectsData.js        ← Inchangé
└── styles/
    └── global.css             ← Inchangé
```

## 🚀 Routes disponibles

- `/` → Page d'accueil (Hero + 2 hero projects + CTA)
- `/films` → Grille de tous les films + post-prod en bas
- `/films/:slug` → Page détail d'un film (ex: `/films/vedette`)
- `/photos` → Grille photos (avec modal lightbox)
- `/contact` → Page contact

## ⚠️ Composants modifiés

### HeroProjects.jsx
Il faut **supprimer** l'utilisation de `ProjectModal` et faire naviguer vers la page détail :

```jsx
// Avant
import ProjectModal from '../ProjectModal/ProjectModal';
const [selectedProject, setSelectedProject] = useState(null);

// Après
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

// Changer le onClick
onClick={() => navigate(`/films/${project.id}`)}
```

Je vais créer la version mise à jour dans le prochain fichier.

## 🧹 Composants à supprimer (optionnel)

Ces composants ne sont plus utilisés :
- `src/components/Films/` (remplacé par `pages/Films.jsx`)
- `src/components/ProjectsInProgress/` (intégré dans `pages/Films.jsx`)
- `src/components/ProjectModal/` (remplacé par `pages/FilmDetail.jsx`)

Tu peux les garder en backup ou les supprimer.

## ✅ Tester

```bash
npm run dev
```

Vérifie que :
1. La navigation fonctionne entre les pages
2. Les films s'ouvrent en page détail (pas en modal)
3. Les photos gardent leur lightbox modal
4. Le header met en surbrillance la page active
