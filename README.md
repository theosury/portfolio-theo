# Portfolio de Théo Sury

Portfolio moderne et professionnel pour présenter vos films et photographies.

## 🚀 Démarrage rapide

### 1. Installation

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

Ouvrir http://localhost:5173 dans ton navigateur.

### 2. Build pour la production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`.

---

## 📁 Structure du projet

```
portfolio-theo/
├── public/              # Images et assets publics
│   └── images/          # Mets TOUTES tes images ici
│       ├── hero-1.jpg
│       ├── vedette-thumb.jpg
│       ├── vedette-1.jpg
│       └── ...
├── src/
│   ├── components/      # Tous les composants React
│   │   ├── Header/
│   │   ├── Hero/
│   │   ├── Films/
│   │   ├── Photos/
│   │   ├── About/
│   │   ├── Contact/
│   │   └── Footer/
│   ├── data/
│   │   └── projectsData.js  # 🔥 FICHIER IMPORTANT : toutes tes données ici
│   ├── styles/
│   │   └── global.css   # Styles globaux
│   ├── App.jsx          # Composant principal
│   └── main.jsx         # Point d'entrée
├── index.html
├── package.json
└── vite.config.js
```

---

## ✏️ Comment modifier le contenu

### 🎯 RÈGLE D'OR

**Tu ne changes JAMAIS le code des composants.**

**Tu modifies UNIQUEMENT le fichier `src/data/projectsData.js`.**

### Ajouter/modifier un film

Ouvre `src/data/projectsData.js`, trouve la section `films:`, et ajoute/modifie :

```javascript
{
  id: 'mon-nouveau-film',
  title: 'Mon Nouveau Film',
  year: '2024',
  school: 'FEMIS',
  role: 'Chef-opérateur',
  director: 'Nom du réalisateur',
  thumbnail: '/images/nouveau-film-thumb.jpg',
  images: [
    '/images/nouveau-film-1.jpg',
    '/images/nouveau-film-2.jpg',
  ],
  description: 'Description du film...',
  specs: {
    format: '16mm',
    camera: 'Arriflex 416',
    objectifs: 'Zeiss Super Speed',
  },
  vimeoLink: 'https://vimeo.com/...'
}
```

### Ajouter/modifier une série photo

Même principe, dans la section `photos:` :

```javascript
{
  id: 'ma-serie-photo',
  title: 'Ma Série Photo',
  year: '2024',
  category: 'Voyage',
  thumbnail: '/images/serie-thumb.jpg',
  images: [
    '/images/serie-1.jpg',
    '/images/serie-2.jpg',
  ],
  description: 'Description de la série...'
}
```

### Modifier "À propos"

Dans `src/data/projectsData.js`, trouve `aboutData`:

```javascript
export const aboutData = {
  title: 'Théo Sury',
  subtitle: 'Chef-opérateur & Assistant caméra',
  bio: `Ton texte ici...`,
  skills: [
    'Compétence 1',
    'Compétence 2',
  ],
  contact: {
    email: 'ton-email@exemple.fr',
    phone: '+33 6 XX XX XX XX',
    instagram: '@theosury',
    vimeo: 'theosury'
  }
};
```

### Modifier les images du Hero (page d'accueil)

Dans `src/data/projectsData.js`, trouve `heroImages`:

```javascript
export const heroImages = [
  {
    src: '/images/hero-1.jpg',
    alt: 'Description',
    project: 'vedette' // ID du projet lié
  },
  // Ajoute 2-3 images max
];
```

---

## 🖼️ Gestion des images

### 1. Où mettre les images ?

**Toutes dans `/public/images/`**

```
public/
└── images/
    ├── hero-1.jpg
    ├── hero-2.jpg
    ├── vedette-thumb.jpg
    ├── vedette-1.jpg
    ├── vedette-2.jpg
    └── ...
```

### 2. Comment les optimiser ?

#### Option A : En ligne (le plus simple)

1. Va sur **https://squoosh.app**
2. Glisse ton image
3. Paramètres recommandés :
   - Format : **WebP** (ou JPEG si problème de compatibilité)
   - Qualité : **75-80%**
   - Resize : **Max 1920px de largeur**
4. Télécharge et mets dans `/public/images/`

#### Option B : Avec un outil local

**ImageMagick** (si tu veux automatiser) :

```bash
# Installer (sur Mac)
brew install imagemagick

# Optimiser une image
convert input.jpg -resize 1920x -quality 80 output.jpg

# Optimiser tout un dossier
for img in *.jpg; do
  convert "$img" -resize 1920x -quality 80 "optimized_$img"
done
```

### 3. Nommer les images

**Convention :**

- `projet-thumb.jpg` → Vignette du projet
- `projet-1.jpg`, `projet-2.jpg` → Images du projet
- `hero-1.jpg` → Images du slider d'accueil

**Exemples concrets :**
- `vedette-thumb.jpg`
- `vedette-1.jpg`
- `sahara-thumb.jpg`
- `sahara-1.jpg`

---

## 🌐 Déploiement sur Netlify

### Méthode 1 : Via l'interface Netlify (le plus simple)

1. Va sur https://app.netlify.com
2. Connecte-toi
3. "Add new site" > "Deploy manually"
4. Glisse le dossier `dist/` (après avoir fait `npm run build`)
5. C'est en ligne !

### Méthode 2 : Via CLI (plus rapide après la première fois)

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Build + Deploy
npm run build
netlify deploy --prod --dir=dist
```

### Lier ton domaine OVH

1. Dans Netlify : "Domain settings" > "Add custom domain"
2. Entre `theosury.fr`
3. Netlify te donne des DNS à configurer
4. Va dans ton compte OVH > DNS > Ajoute les DNS de Netlify
5. Attends 10-30 minutes pour la propagation

---

## 🐛 En cas de problème

### Le site ne se lance pas

```bash
# Supprime node_modules et réinstalle
rm -rf node_modules
npm install
npm run dev
```

### Les images ne s'affichent pas

1. Vérifie que les images sont bien dans `/public/images/`
2. Vérifie les chemins dans `projectsData.js` (doivent commencer par `/images/`)
3. Vérifie que les noms de fichiers correspondent exactement (majuscules/minuscules)

### Le build échoue

```bash
# Vérifie qu'il n'y a pas d'erreur de syntaxe
npm run build

# Si erreur, lis le message et corrige le fichier indiqué
```

### Erreur 404 sur Netlify après refresh

Crée un fichier `public/_redirects` avec :

```
/*    /index.html   200
```

Puis re-build et re-deploy.

---

## 📚 Git (fortement recommandé)

### Pourquoi utiliser Git ?

- **Sauvegarde** : Tu ne perds jamais ton code
- **Historique** : Tu peux revenir en arrière si tu casses quelque chose
- **Collaboration** : Facile de partager/modifier avec d'autres
- **Netlify automatique** : Déploiement auto à chaque modification

### Installation et premier commit

```bash
# Installer Git (Mac)
brew install git

# Configurer (première fois seulement)
git config --global user.name "Theo Sury"
git config --global user.email "ton-email@exemple.fr"

# Initialiser le repo dans ton projet
cd portfolio-theo
git init

# Créer .gitignore
echo "node_modules
dist
.DS_Store" > .gitignore

# Premier commit
git add .
git commit -m "Initial commit - Portfolio v2"
```

### Créer un repo GitHub

1. Va sur https://github.com
2. "New repository"
3. Nomme-le `portfolio-theo`
4. Ne coche rien (pas de README, etc.)
5. Copie les commandes et exécute-les :

```bash
git remote add origin https://github.com/ton-username/portfolio-theo.git
git branch -M main
git push -u origin main
```

### Workflow quotidien

```bash
# Voir ce qui a changé
git status

# Ajouter les modifications
git add .

# Créer un commit
git commit -m "Ajout du film Vedette"

# Envoyer sur GitHub
git push
```

### Connecter Netlify à GitHub (déploiement automatique)

1. Dans Netlify : "Add new site" > "Import an existing project"
2. Connecte GitHub
3. Choisis ton repo `portfolio-theo`
4. Build command : `npm run build`
5. Publish directory : `dist`
6. Deploy !

**Maintenant, à chaque `git push`, ton site se met à jour automatiquement !**

---

## 🎨 Personnalisation avancée

### Changer les couleurs

Dans `src/styles/global.css`, modifie les variables CSS :

```css
:root {
  --color-bg: #000000;           /* Couleur de fond */
  --color-text: #ffffff;         /* Couleur du texte */
  --color-accent: #ff3b3b;       /* Couleur d'accent (rouge) */
  --color-hover: #ff6b6b;        /* Couleur au survol */
}
```

### Modifier les espacements

```css
:root {
  --spacing-sm: 1rem;   /* Petit espacement */
  --spacing-md: 2rem;   /* Moyen */
  --spacing-lg: 4rem;   /* Grand */
  --spacing-xl: 6rem;   /* Très grand */
}
```

---

## ✅ Checklist avant mise en ligne

- [ ] Toutes les images sont optimisées (< 500 Ko chacune)
- [ ] Les informations dans `projectsData.js` sont à jour
- [ ] L'email de contact est correct
- [ ] Les liens Vimeo/Instagram fonctionnent
- [ ] Testé sur mobile (responsive)
- [ ] Testé sur différents navigateurs (Chrome, Firefox, Safari)
- [ ] `npm run build` fonctionne sans erreur
- [ ] Fichier `_redirects` créé dans `/public/`

---

## 🆘 Besoin d'aide ?

### Ressources

- **React** : https://react.dev
- **Vite** : https://vitejs.dev
- **Netlify** : https://docs.netlify.com
- **Git** : https://git-scm.com/book/fr/v2

### Commandes utiles

```bash
npm run dev          # Lancer en développement
npm run build        # Build pour production
npm run preview      # Prévisualiser le build
```

---

## 🔥 Prochaines améliorations possibles

- [ ] Ajouter des animations au scroll
- [ ] Ajouter un mode sombre/clair
- [ ] Intégrer des vidéos Vimeo directement dans les modales
- [ ] Ajouter un formulaire de contact
- [ ] Ajouter Google Analytics
- [ ] Optimiser le SEO (meta tags, sitemap)
- [ ] Ajouter un loader au chargement des images
- [ ] Version multilingue (FR/EN)

---

**Développé avec ❤️ par Claude & Théo**
