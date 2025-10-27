# Structure des images - Exemple

Voici comment organiser tes images dans /public/images/ :

```
public/
└── images/
    ├── # IMAGES HERO (slider page d'accueil)
    ├── hero-1.jpg          # Image 1 du slider
    ├── hero-2.jpg          # Image 2 du slider
    ├── hero-3.jpg          # Image 3 du slider
    │
    ├── # FILMS
    ├── vedette-thumb.jpg   # Vignette du film Vedette
    ├── vedette-1.jpg       # Image 1 du film
    ├── vedette-2.jpg       # Image 2 du film
    ├── vedette-3.jpg       # Image 3 du film
    │
    ├── darwin-thumb.jpg    # Vignette du film Darwin
    ├── darwin-1.jpg        # Image 1 du film
    ├── darwin-2.jpg        # Image 2 du film
    │
    ├── grandsoir-thumb.jpg # Vignette Le Grand Soir
    │
    ├── # PHOTOS
    ├── sahara-thumb.jpg    # Vignette série Sahara
    ├── sahara-1.jpg        # Image 1 de la série
    ├── sahara-2.jpg        # Image 2 de la série
    ├── sahara-3.jpg        # Etc.
    │
    ├── portraits-thumb.jpg # Vignette série Portraits
    ├── portrait-1.jpg
    ├── portrait-2.jpg
    │
    └── # AUTRES
        ├── pmu-thumb.jpg
        └── rennes-thumb.jpg
```

## Conventions de nommage

- **Toujours en minuscules**
- **Pas d'espaces** (utilise des tirets `-`)
- **Format** : `projet-type.jpg`
  - `projet` = nom du projet
  - `type` = thumb, 1, 2, 3, etc.

## Poids recommandé

- **Thumbnails** : 100-200 Ko max
- **Images complètes** : 300-500 Ko max
- **Hero images** : 500-800 Ko max (elles sont grandes)

## Dimensions recommandées

- **Thumbnails** : 800-1000px de largeur
- **Images complètes** : 1920px de largeur max
- **Hero images** : 1920px de largeur

## Optimisation rapide

Sur https://squoosh.app :
1. Upload ton image
2. Format : WebP (ou JPEG)
3. Qualité : 75-80%
4. Resize : 1920px max
5. Télécharge et renomme
