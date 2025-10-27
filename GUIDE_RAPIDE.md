# 🚀 GUIDE DE DÉMARRAGE RAPIDE

## Étape 1 : Installation (une seule fois)

```bash
# Dans le terminal, aller dans le dossier
cd portfolio-theo

# Installer les dépendances
npm install
```

## Étape 2 : Lancer le site en local

```bash
npm run dev
```

Ouvre ton navigateur sur http://localhost:5173

---

## ⚡ Modifier le contenu

**1 SEUL FICHIER À MODIFIER : `src/data/projectsData.js`**

### Ajouter un film

```javascript
{
  id: 'mon-film',
  title: 'Mon Film',
  year: '2024',
  school: 'FEMIS',
  role: 'Chef-opérateur',
  thumbnail: '/images/mon-film-thumb.jpg',
  images: ['/images/mon-film-1.jpg'],
  description: 'Description...'
}
```

### Ajouter une photo

```javascript
{
  id: 'ma-photo',
  title: 'Ma Série Photo',
  year: '2024',
  category: 'Voyage',
  thumbnail: '/images/photo-thumb.jpg',
  images: ['/images/photo-1.jpg']
}
```

---

## 🖼️ Ajouter des images

1. Mets toutes tes images dans `/public/images/`
2. Optimise-les sur https://squoosh.app (qualité 75-80%, max 1920px)
3. Dans `projectsData.js`, utilise le chemin `/images/ton-image.jpg`

---

## 🌐 Mettre en ligne sur Netlify

### Première fois

```bash
# Build le site
npm run build

# Sur Netlify : "Deploy manually" > glisse le dossier "dist"
```

### Méthode automatique (recommandée)

1. Crée un compte GitHub
2. Upload ton code sur GitHub
3. Connecte Netlify à GitHub
4. À chaque modification → site mis à jour automatiquement !

---

## 🆘 Problèmes fréquents

### Les images ne s'affichent pas
✅ Vérifie qu'elles sont dans `/public/images/`
✅ Vérifie les chemins dans `projectsData.js`

### Le build ne marche pas
```bash
rm -rf node_modules
npm install
npm run build
```

### Erreur 404 sur Netlify après refresh
✅ Le fichier `public/_redirects` doit exister (c'est déjà fait)

---

## 📞 Commandes essentielles

```bash
npm install       # Installer les dépendances
npm run dev       # Lancer en local
npm run build     # Build pour production
```

---

**C'est tout ! Simple et efficace. 🎬**
