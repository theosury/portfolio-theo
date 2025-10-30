// =============================================
// CONFIGURATION DES PROJETS
// =============================================

// Fonction pour parser les dates et trier
const parseDate = (project) => {
  if (project.month) {
    // Format attendu : "Mars 2025" ou "Février-Mars 2024"
    const match = project.month.match(/(\w+)\s*-?\s*(\w+)?\s*(\d{4})/);
    if (match) {
      const monthsMap = {
        'janvier': 1, 'février': 2, 'mars': 3, 'avril': 4, 'mai': 5, 'juin': 6,
        'juillet': 7, 'aout': 8, 'septembre': 9, 'octobre': 10, 'novembre': 11, 'décembre': 12
      };
      const monthName = match[2] ? match[2].toLowerCase() : match[1].toLowerCase();
      const month = monthsMap[monthName] || 1;
      const year = parseInt(match[3]);
      return new Date(year, month - 1);
    }
  }
  // Sinon, utiliser l'année uniquement
  return new Date(parseInt(project.year || 2000), 0);
};

// Fonction de tri (du plus récent au plus ancien)
const sortProjectsByDate = (projects) => {
  return [...projects].sort((a, b) => {
    const dateA = parseDate(a);
    const dateB = parseDate(b);
    return dateB - dateA; // Ordre décroissant
  });
};

export const projectsData = {
  // ========== IDs DES PROJETS HERO ==========
  // Pour ajouter un projet en hero, ajoute simplement son ID ici
  heroProjectIds: ['vedette', 'vagues'],

  // ========== PROJETS HERO (générés automatiquement depuis films) ==========
  get heroProjects() {
    return this.films.filter(film => this.heroProjectIds.includes(film.id));
  },

  // ========== TOUS LES PROJETS (triés automatiquement par catégorie) ==========
  get films() {
    const allFilms = [
      {
        id: 'vedette',
        title: 'Vedette !',
        year: '2024',
        month: 'Février-Mars 2024',
        role: 'Chef-opérateur / Cadreur',
        coChefOp: 'Isaac Gorin',
        realisateurs: 'Augustin Provost & Konrad Galice',
        production: 'ESEC',
        thumbnail: '/images/vedette-thumb.jpg',
        images: [],
        youtubeId: 'huDt5YegK_k',
        description: 'Claude, une ancienne vedette en déclin, se bat avec le réalisateur pour tourner une scène romantique avec sa co-star Olivia Ricci. Il regrette alors son souhait lorsqu\'il découvre qu\'Olivia est en réalité sa fille, mais le réalisateur est décidé à lui faire tourner cette scène et Olivia est bien décidée à lui faire regretter son abandon de responsabilité paternel.',
        synopsis: 'Pastiche des années 50 tourné en studio. Deux ambiances distinctes : le "film dans le film" avec un éclairage doux très studio, dolly et longues focales, et la partie "hors du film" très contrastée, en plans fixes stricts au 18mm.',
        etalonneur: 'Marion de Ravel de l\'Argentière',
        specs: {
          format: 'Court-métrage fiction',
          duree: '14min08',
          jours: '2 jours',
          lieu: 'Studio',
          camera: 'Arri ALEXA SXT Plus',
          objectifs: 'Cooke S4',
        },
        cast: [
          'Gilbert Coudurier (Claude Berr)',
          'Luna Kozaczka (Olivia Ricci)',
          'Stéphane de Oliveira (Réalisateur)'
        ]
      },
      {
        id: 'vagues',
        title: 'Ce que laissent les vagues',
        year: '2024',
        month: 'Mai 2024',
        role: 'Cadreur',
        chefOp: 'Isaac Gorin',
        realisatrices: 'Luce Paz & Ana Maria Garza Flores',
        production: 'ESEC',
        thumbnail: '/images/vagues-thumb.jpg',
        images: [],
        youtubeId: 'BC1k5pwd-_8',
        description: 'Pablo est un gitan qui vit seul près de la mer. Ce lieu est devenu son refuge depuis ses 19 ans, âge auquel il est tombé amoureux de son unique amour, Alice, avant de la perdre tragiquement cette même année. Forcé de quitter le seul endroit où il a vu son bonheur, il replonge dans ses souvenirs comme pour plonger avec Alice, la retrouver, quitte à ne plus en émerger.',
        synopsis: 'Deux époques se confrontent : un présent sombre et désaturé face à un passé chaud aux couleurs vives. Tournage en Bretagne avec Easyrig pour suivre les mouvements des personnages sur la plage. Plans dynamiques et sensoriels pour traduire la mémoire de Pablo.',
        specs: {
          format: 'Court-métrage fiction',
          duree: '12min44',
          jours: '5 jours',
          lieu: 'Bretagne',
          camera: 'Arri ALEXA SXT Plus',
          objectifs: 'Cooke S4',
          cadrage: 'Easyrig'
        },
        cast: [
          'Ambryn Guedin (Pablo Jeune)',
          'Audrey Bauer (Alice)',
          'Joel Perruch (Pablo Vieux)'
        ]
      },
      {
        id: 'male-addict',
        title: 'Mâle Addict',
        year: '2025',
        month: 'Mars 2025',
        role: 'Chef-opérateur',
        coChefOp: 'À confirmer',
        realisateurs: 'Victoria Baverey & Pierre Vaxelaire',
        production: 'Cours Florent',
        thumbnail: '/images/male-addict-thumb.jpg',
        status: 'En post-production',
        images: [],
        description: 'Triangle amoureux toxique entre Mathis, Thalia et Tom. Mathis et Thalia ont une liaison secrète alors que Thalia est en couple avec Tom, le meilleur ami de Mathis.',
        synopsis: 'L\'histoire explore la manipulation, la trahison et les conséquences d\'une relation destructrice entre trois jeunes adultes pris dans un jeu dangereux de désir et de mensonges.',
        specs: {
          format: 'Moyen-métrage fiction',
          duree: '40-50min (estimation)',
          jours: '10 jours (2 semaines)',
          camera: 'Blackmagic 6K'
        }
      },
      {
        id: 'gate66',
        title: 'Gate 66',
        year: '2025',
        month: 'Septembre 2025',
        role: '1er assistant caméra B',
        realisateur: 'Maël Kerever',
        chefOp: 'Bastien Leprince',
        production: 'École 24 × ArtFX',
        thumbnail: '/images/gate66-thumb.jpg',
        status: 'En post-production',
        images: [],
        specs: {
          format: 'Court-métrage',
          lieu: 'Plaine Image, Tourcoing',
          tournage: 'Septembre 2025',
          particularite: 'Dolly, machine à fumée, green screen'
        }
      },
      {
        id: 'bbc',
        title: 'BBC',
        year: '2025',
        month: 'Aout 2025',
        role: 'Électricien',
        realisateurs: 'Joaquim Tivoukou & Naïr Mlanao',
        chefOp: 'Jerry Pradon',
        chefElectro: 'Leo Aguiton',
        production: 'MOLIMO Prod',
        thumbnail: '/images/bbc-thumb.jpg',
        status: 'En post-production',
        images: [],
        description: 'Xavier et Awa rentrent chez eux et croisent Madame Kogo dans l\'ascenseur. Elle apprend qu\'Awa va avoir une fille et confronte Xavier sur son passé, lui indiquant qu\'il doit procéder à un processus de réparation avant de devenir père.',
        specs: {
          format: 'Court-métrage fiction',
          duree: '~15min',
          jours: '6 jours',
          camera: 'Arri ALEXA 35',
          tournage: 'Août 2025',
          lieu: 'Paris'
        },
        cast: [
          'Joaquim Tivoukou (Xavier)',
          'Loréna Massikini (Awa)',
          'Elisabeth Milla (Mme Kogo)'
        ]
      },
      {
        id: 'verite-studio',
        title: 'Vérité Studio',
        year: '2025',
        month: 'Juillet 2025',
        role: 'Électricien',
        realisatrice: 'Khadija Sy',
        production: 'Point E × La Fémis',
        thumbnail: '/images/verite-studio-thumb.jpg',
        status: 'En post-production',
        images: [],
        specs: {
          lieu: 'LCR Les Tailleurs, Villeneuve-d\'Ascq',
          tournage: 'Juillet 2025'
        }
      },
      {
        id: 'azincourt',
        title: 'Azincourt',
        year: '2025',
        month: 'Octobre 2025',
        role: 'Électricien',
        realisateur: 'Adrien Guillet',
        chefOp: 'Axel Dos Santos',
        chefElectro: 'Alexandre Chadha',
        production: 'VHS Prod',
        thumbnail: '/images/azincourt-thumb.jpg',
        status: 'En post-production',
        images: [],
        specs: {
          format: 'Court-métrage médiéval',
          lieu: 'Château de la Lande, Montaigu-Vendée',
          tournage: 'Octobre 2025',
          particularite: 'Scènes de bataille, effets flèches 3D'
        }
      },
      {
        id: 'armanaque',
        title: 'Armanaque',
        year: '2024',
        month: 'Juillet 2024',
        role: 'Chef-opérateur',
        production: 'Auto-produit',
        thumbnail: '/images/armanaque-thumb.jpg',
        images: [],
        description: 'Moyen-métrage fiction (45min52) tourné en 2 semaines en banlieue parisienne. Film auto-produit avec matériel prêté par le Cours Florent et l\'ESEC.',
        synopsis: 'Lumière dure à contre-jour, soleil écrasant et zones cramées pour un rendu chaud et organique. Exploration du point de vue avec de nombreux champ-contre-champ, caméra au plus proche des personnages pour servir le ton comédie. Défi technique : moyen-métrage tourné en FS7 avec uniquement du tungstène.',
        youtubeId: 'gJY3ENECfbQ',
        specs: {
          format: 'Moyen-métrage fiction',
          duree: '45min52',
          jours: '2 semaines',
          lieu: 'Banlieue parisienne',
          camera: 'Sony FS7',
          budget: 'Très faible',
          lumiere: 'Tungstène uniquement'
        }
      },
      {
        id: 'pardon',
        title: 'Pardon',
        year: '2024',
        month: 'Décembre 2024',
        role: '1er assistant caméra',
        realisatrice: 'Virginie Courteille',
        chefOp: 'Isaac Gorin',
        production: 'Nikon Film Festival',
        thumbnail: '/images/pardon-thumb.jpg',
        youtubeId: '9qQdzhmH8O0',
        specs: {
          format: 'Court-métrage',
          lieu: 'Paris',
          tournage: 'Décembre 2024'
        }
      },
      {
        id: 'casse-noisette',
        title: 'Casse-Noisette',
        year: '2024',
        month: 'Juin 2024',
        role: 'Chef-opérateur',
        realisateur: 'Tristan Lonné',
        production: 'ESEC',
        thumbnail: '/images/casse-noisette-thumb.jpg',
        images: [],
        vimeoId: '1026723522',
        description: 'Court-métrage studio tourné en une journée lors des portes ouvertes de l\'ESEC. Carte blanche, style inspiré de The Office mais en plus malaisant.',
        specs: {
          format: 'Court-métrage studio',
          jours: '1 jour',
          camera: 'Arri ALEXA Classic',
          objectifs: 'Angénieux Optimo',
        },
        cast: [
          'Frederic Chateau (Franck/Père Noël)',
          'Noémie Garbarg (Maya)',
          'Gary Muguet (Jordan)'
        ]
      },
      {
        id: 'quand-son-souffle',
        title: 'Quand son souffle s\'est arrêté',
        year: '2024',
        month: 'Avril 2024',
        role: '2e assistant caméra',
        realisatrice: 'Nina Gavras',
        chefOp: 'Léo Rodella',
        production: 'ESEC',
        thumbnail: '/images/quand-son-souffle-thumb.jpg',
        images: [],
        youtubeId: 'epDfHUrlK_0',
        description: 'Film de fin d\'études ESEC.',
        specs: {
          format: 'Court-métrage fiction',
          lieu: 'Maisons-Laffitte',
          tournage: 'Avril 2024'
        }
      },
      {
        id: 'loverdance',
        title: 'Loverdance',
        year: '2024',
        month: 'Juillet 2024',
        role: 'Régisseur adjoint',
        realisateur: 'Victor Gomez',
        directricePhoto: 'Louise Bernard Pallas',
        production: 'ARTE × La Fémis',
        thumbnail: '/images/loverdance-thumb.jpg',
        images: [],
        description: 'Lola rencontre Simon lors d\'un marathon de 24 heures de danse. Alors que la compétition bat son plein, ils développent une complicité qui la détourne de son objectif. Mais les éliminations se succèdent à un rythme effréné et, à bout de souffle, elle décide de s\'unir à lui pour une danse qui pourrait bien les mener à la victoire…',
        arteId: '119915-009-A?autoplay=true&mute=0',
        specs: {
          format: 'Court-métrage fiction',
          coproduction: 'Filmakademie Baden-Württemberg, La Fémis, ARTE, SWR',
          pays: 'France',
          annee: '2024'
        },
        cast: [
          'Yannick Blivet (Animateur)',
          'Frederico Semedo (Simon)',
          'Louise Luck (Lola)'
        ]
      },
      {
        id: 'insipide',
        title: 'Insipide',
        year: '2023',
        month: 'Novembre 2023',
        role: 'Réalisateur',
        chefOp: 'Solal Alenda',
        realisation: 'Theo Sury',
        montage: 'Theo Sury',
        thumbnail: '/images/insipide-valse-thumb.jpg',
        images: [],
        youtubeIds: [
          {
            id: 'tNIKhZKBRLk'
          },
          {
            id: 'AJoQw8D-Ph4'
          },
          {
            id: 'gXo5zLmihIA'
          }
        ],
        description: 'Série de trois trailers pour la collection "Insipide", créée par Mathilde Duquénoy. Clips mode conceptualisés par Theo Sury, Solal Alenda et Mathilde Duquénoy.',
        synopsis: 'Trois univers distincts : La Valse (danse inquiétante), Le Mépris (tension solitaire), La Fuite (course éperdue).',
        specs: {
          production: 'Auto-produit - Suburb TV en assistance',
          format: 'Clips mode',
          etalonnage: 'Solal Alenda',
          location: 'RVZ & Puzzle Video'
        },
        cast: [
          'La Valse : Ethan Wallevrick & Bill Tuan (Valseurs), Axel Lessieur (Angoisse)',
          'Le Mépris : Clothilde Merlin (Jeune fille), Axel Lessieur (Angoisse)',
          'La Fuite : Ariel Duquesne (Homme aux talons), Axel Lessieur (Angoisse), '
        ]
      },
      {
        id: 'gadfly',
        title: 'GADFLY',
        year: '2023',
        month: 'Octobre 2023',
        role: 'Stagiaire Électricien / Machino',
        realisateur: 'Taylor Knight',
        chefElectro: 'Jérémie Dignac',
        directricePhoto: 'Micaela Albanese',
        production: 'Pictor Prod × BAVARD',
        thumbnail: '/images/gadfly-thumb.jpg',
        images: [
          '/images/gadfly-snaps/gadfly-1.jpg',
          '/images/gadfly-snaps/gadfly-2.jpg',
          '/images/gadfly-snaps/gadfly-3.jpg',
          '/images/gadfly-snaps/gadfly-4.jpg',
          '/images/gadfly-snaps/gadfly-5.jpg',
          '/images/gadfly-snaps/gadfly-6.jpg',
          '/images/gadfly-snaps/gadfly-7.jpg'
        ],
        description: 'Court-métrage produit par Pictor Prod.',
        specs: {
          format: 'Court-métrage'
        }
      },
      {
        id: 'revolte',
        title: 'Le Révolté',
        year: '2023',
        month: 'Mai 2023',
        role: 'Chef électro',
        realisateur: 'Nicolas Baste',
        cheffeOp: 'Louise Stein',
        production: 'ESEC',
        thumbnail: '/images/revolte-thumb.jpg',
        images: [],
        youtubeId: 'PPvxZQ_3x3c',
        description: 'Louis, un fils d\'immigrés chinois manifestant en France contre la politique du gouvernement, entre en conflit avec son père quand il apprend que celui-ci désapprouve sa révolte dans ce qui est pour lui une terre d\'accueil. Film de fin de cycle 1.',
        specs: {
          format: 'Court-métrage fiction',
          annee: '2023'
        },
        cast: [
          'Andrea Zamparo',
          'Longmon Wang',
          'Rong-Ying Yang'
        ]
      },
      {
        id: 'une-couronne',
        title: 'Une Couronne',
        year: '2022',
        month: 'Juin 2022',
        role: 'Auxiliaire de régie',
        realisateurs: 'Salma Taibi & Bruno Ribuot-Hirsch',
        cheffeOp: 'Syvian Qi',
        production: 'ESEC',
        thumbnail: '/images/une-couronne-thumb.jpg',
        images: [],
        youtubeId: 'c9wZt6gs-ZU',
        description: 'Sybille est la comédienne la plus populaire de son époque. Mère dirigiste et autoritaire, elle pousse sa fille Flora à rentrer dans le milieu. Mais la jeunesse de Flora effacera le succès de sa mère qui semblait être éternel… Film de fin d\'études ESEC.',
        specs: {
          format: 'Court-métrage fiction',
          annee: '2022'
        },
        cast: [
          'Maëlle Genet',
          'Olivia Jubin',
          'François Ayrault'
        ]
      },
    ];

    // Trier tous les films (les composants filtreront ensuite)
    return sortProjectsByDate(allFilms);
  },

  // ========== AUTRES EXPÉRIENCES ==========
  autres: [
    {
      id: 'darwin-experience',
      title: 'Darwin Experience',
      year: '2025',
      role: 'Photographe & Making-of',
      realisateur: 'Martin Schrepel',
      chefOp: 'Grégoire Léon-Dufour',
      production: 'Making-of EP "Home"',
      thumbnail: '/images/darwinthumb.jpg',
      description: 'Captation et montage du making-of de l\'EP "Home" du groupe Darwin Experience. Clips : Automatic Doors, Home, I Killed You, I Just Want to Dance.',
      specs: {
        format: 'Making-of / Clips musicaux',
        production: 'PRISM, CNC',
        lieu: 'Le Havre',
        jours: '3 jours (janvier 2025)'
      }
    },
    {
      id: 'panavision',
      title: 'Panavision ALGA',
      year: '2024',
      role: 'Stagiaire',
      production: '3 mois - Magasin & Filtres',
      thumbnail: '/images/panavisionthumb.jpg',
      description: 'Stage maintenance caméra et configuration. Vérification et maintenance d\'accessoires caméra et filtres, rangement du stock, préparation de commandes, configuration caméra.'
    },
    {
      id: 'dixit-afdas',
      title: 'DIXIT — AFDAS',
      year: '2025',
      role: 'Assistant technique (cadre, lumière, régie)',
      production: 'Formation direction d\'acteur',
      thumbnail: '/images/dixitthumb.jpg',
      description: 'Captation de formations en direction d\'acteur (janvier & juin 2025).'
    },
    {
      id: 'noctem',
      title: 'Noctem Events',
      year: '2023-2024',
      role: 'Photographe',
      production: 'Événementiel',
      thumbnail: '/images/noctemthumb.jpg',
      description: 'Photographie événementielle en conditions de faible lumière.'
    },
    {
      id: 'dna',
      title: 'Demain Nous Appartient (DNA)',
      year: '2024',
      role: '3e assistant caméra',
      realisateurs: 'Alexis Charrier & Thomas Lipmann',
      directeursPhoto: 'William Hulin & Hervé Lodé',
      production: 'Fédération Entertainment - TELSETE',
      thumbnail: '/images/dnathumb.jpg',
      description: 'Stage de 3e assistant caméra sur la série quotidienne de TF1. Deux sessions d\'une semaine chacune.',
      specs: {
        duree: '2 sessions de 1 semaine'
      }
    }
  ]
};

// ========== DONNÉES "À PROPOS" ==========
export const aboutData = {
  title: 'Théo Sury',
  subtitle: 'Chef-opérateur & Technicien lumière',
  specialization: 'Fiction, clips & formats courts',
  location: 'Lille / Paris',
  
  bio: `Technicien lumière et chef-opérateur, je me spécialise dans la fiction et les clips musicaux.

Mon parcours m'a conduit de la régie au poste de chef-opérateur, en passant par l'assistanat caméra et l'électricité. Cette polyvalence me permet d'appréhender chaque projet avec une vision technique complète.

J'interviens actuellement sur des courts et moyens-métrages, des clips musicaux et des formats courts, avec un intérêt particulier pour la direction artistique lumière.`,
  
  skills: [
    'Direction de la photographie',
    'Chef électricien',
    'Technicien lumière',
    'Assistant caméra',
    'Régie lumière',
    'Étalonnage'
  ],
  
  parcours: [
    {
      year: '2025',
      title: 'Chef-opérateur freelance',
      description: 'Fiction et clips musicaux'
    },
    {
      year: '2024',
      title: 'Chef électricien',
      description: 'Courts-métrages et productions'
    },
    {
      year: '2024',
      title: 'Stage Panavision ALGA',
      description: 'Maintenance caméra et filtres'
    },
    {
      year: '2024',
      title: '3e assistant caméra - DNA',
      description: 'Fédération Entertainment'
    }
  ],
  
  contact: {
    email: 'theosury@gmail.com',
    phone: '07 50 84 62 01',
    instagram: '@theosury',
    vimeo: '',
    linkedin: '@theosury'
  }
};