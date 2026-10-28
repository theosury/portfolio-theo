// =============================================
// CONFIGURATION DES PROJETS
// =============================================

// Fonction pour parser les dates et trier
const parseDate = (project) => {
  if (project.month) {
    // Format attendu : "Mars 2025" ou "Février-Mars 2024"
    // \p{L} plutôt que \w : ce dernier ignore les lettres accentuées,
    // et « Décembre » n'était capturé que comme « cembre ».
    const match = project.month.match(/(\p{L}+)\s*-?\s*(\p{L}+)?\s*(\d{4})/u);
    if (match) {
      // Clés sans accent : la saisie est normalisée juste en dessous,
      // pour que « Décembre » et « decembre » donnent le même résultat.
      const monthsMap = {
        'janvier': 1, 'fevrier': 2, 'mars': 3, 'avril': 4, 'mai': 5, 'juin': 6,
        'juillet': 7, 'aout': 8, 'septembre': 9, 'octobre': 10, 'novembre': 11, 'decembre': 12
      };
      const sansAccent = (mot) =>
        mot.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      const monthName = sansAccent(match[2] || match[1]);
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

// ========== ORDRE MANUEL ==========
// Ordre exact de la grille, ligne par ligne (3 cartes par ligne sur desktop).
// Un film absent de cette liste vient après, classé par date : penser à
// ajouter ici les nouveaux projets pour maîtriser leur position.
// Laisser le tableau vide pour revenir au tri par date sur l'ensemble.
export const ordreManuel = [
  // Ordre « portfolio » : les images les plus fortes et les plus moody d'abord,
  // image ou lumière (les films à beaux effets de lumière comptent même en électro)
  'vedette',             // chef-op, studio noir et blanc
  'asterix',             // réalisation : crépuscule, intime
  'vagues',              // Ce que laissent les vagues (cadre)
  'ziak-feng-shui',      // électro : faisceaux, lumière au pupitre
  'casse-cest-casse',    // électro : cheval sous la pluie, colombe dans la fumée
  'the-right-choice',    // chef électro, plus petit projet : tunnel, pyrotechnie
  'insipide',            // réalisation
  'tecnomat',            // pub TV
  'armanaque',
  'quand-son-souffle',   // contre-jours, forêt, soleil couchant
  // En post-production (section « En cours »)
  'super-vespapa',
  'jugement-dernier',
  'azincourt',
  'gate66',
];

// ========== SECOND PLAN ==========
// Les IDs listés ici sortent de la grille principale et sont regroupés
// derrière le lien « Voir les autres projets », en bas de la page Films.
// Indépendant du champ « status » : un film peut être en post-production
// et rester en grille principale (ou l'inverse).
export const projetsSecondaires = [
  'nothing-personal',
  'moutarderie-fallot-vr',
  'cache-toi-cest-mon-pere',
  'male-addict',
  'trauma-resonance',
  'lettre-a-lille',
  'la-table-regie',
  'undetoi',
  'verite-studio',        // pas encore d'extraits
  'gadfly',              // stagiaire ; terminé en septembre 2025 (FilmFreeway), pas encore diffusé
  'une-couronne',        // auxiliaire de régie, ESEC 2022 (extraits sur sa fiche)
  'bbc',
  'pub-vs-ia',           // pas de film public (festivals) : photos de tournage
  'marcus',              // prélight électro (3 jours), tournage 14 oct 2026 à la Montjoie
  'nikon-mamie',         // Nikon de Vivi tourné du 23 au 25 oct 2026, en montage en novembre
  'nikon-vivi',          // « Mona » = titre du scénario, titre final à confirmer ; film pas encore retrouvé  // Sortis de la grande grille (audit du 11 oct 2026) : projets plus petits
  // ou poste sans rapport avec la lumière et l'image
  'bureau-du-karma',     // 1 minute, festival
  'casse-noisette',      // portes ouvertes ESEC, une journée
  'mode-kids',
  'pardon',              // 1er assistant caméra
  'loverdance',          // régisseur adjoint (production ARTE / La Fémis)
  'revolte',             // film de 2e année d'école
];

// Applique l'ordre manuel puis le tri par date sur le reste
const appliquerOrdre = (projects) => {
  const epingles = ordreManuel
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean);
  const reste = projects.filter((p) => !ordreManuel.includes(p.id));
  return [...epingles, ...sortProjectsByDate(reste)];
};

export const projectsData = {
  // ========== IDs DES PROJETS HERO ==========
  // Pour ajouter un projet en hero, ajoute simplement son ID ici
  heroProjectIds: ['vedette', 'asterix', 'vagues', 'ziak-feng-shui'],

  // ========== PROJETS HERO (générés automatiquement depuis films) ==========
  get heroProjects() {
    return this.films.filter(film => this.heroProjectIds.includes(film.id));
  },

  // ========== TOUS LES PROJETS (triés automatiquement par catégorie) ==========
  get films() {
    const allFilms = [
      {
        id: 'tecnomat',
        coordProd: 'Léonie Truin',
        dirProd: 'Gabrielle Hennessy',
        boucles: [1, 3, 2].map((n) => `/videos/boucles/tecnomat-${n}`), // extraits muets enchaînés dans la grille
        boucleRatio: '1200 / 616', // format de la pub (bandes noires retirées)
        title: 'Tecnomat, vivez vos meilleurs chantiers',
        year: '2026',
        month: 'Juillet 2026',
        role: 'Électricien',
        realisateur: 'Léo Sattin',
        production: 'Poolside Theory × Socialclub',
        prodExec: 'Valentin Fertillet',
        premierAssReal: 'Estelle Duhem',
        chefOp: 'Lenny Lu',
        assistantCam: 'Patrick Nishimwbe & Félix Debeus',
        dit: 'Jan Maes',
        chefElectro: 'Milo Cosemans',
        electros: 'Théo Sury & Eliza Mezquita-Lucena',
        chefMachino: 'Mathijs Van Burgt',
        machino: 'Laurence De Cort',
        son: 'Fabien Lutz',
        costume: 'Leila Rossard',
        maquillage: 'Manuela Bourgade',
        regisseur: 'Salomé Collin',
        assistRegie: 'Virgile Vermeulen',
        thumbnail: '/images/tecnomat-thumb.webp',
        images: [],
        // Les deux films TV diffusés (20 s chacun)
        youtubeIds: [
          { id: 'jcBrf4wYUFU', title: 'La salle de bains d\'Hervé' },
          { id: 'VTrNGDpIBoo', title: 'L\'aménagement des combles par Alex' },
        ],
        description: 'Deux films TV pour l\'enseigne de matériaux Tecnomat, diffusés en septembre 2026 et tournés en studio en Belgique. Deux décors montés sur le plateau : une salle de bain et des combles aménagés en chambre d\'enfant.',
        specs: {
          format: 'Publicité',
          jours: '2 jours',
          tournage: 'Juillet 2026',
          lieu: 'Studio EVO, Froyennes (Belgique)',
          particularite: 'Décors studio, dolly, mur mobile',
        },
        cast: [
          'Benoît Strulus (L\'Homme)',
          'Jan Debski (Pro Tecnomat 1)',
          'Annette Duhamel (La Mère)',
          'Audrey David (La Femme)',
          'Nicolas Mouen (Pro Tecnomat 2)'
        ]
      },
      {
        id: 'ziak-feng-shui',
        boucles: [1, 2, 3].map((n) => `/videos/boucles/ziak-feng-shui-${n}`), // extraits muets enchaînés dans la grille
        boucleRatio: '1200 / 662', // format des extraits (bandes noires retirées)
        title: 'Feng Shui',
        year: '2026',
        month: 'Juin 2026',
        role: 'Électricien',
        artiste: 'Ziak',
        // Équipe : liste technique du 26 avril 2026
        realisateur: 'Jonathan Steuer',
        premierAssReal: 'Jules Dormoy',
        choregraphe: 'Charles Heinrich',
        producteur: 'Jim Schachmes',
        dirProd: 'Tosca Poilliot',
        coordProd: 'Lola Olivero',
        cheffeOp: 'Malgo Rabczuk',
        assistantCam: 'Florent Planet',
        secondAssistantCam: 'Sacha Muleris',
        pupitreur: 'Jean Maxence Chagnon',
        stylisme: 'Charles Beugniot',
        assistantStylisme: 'Marie Ferrer',
        cheffeElectro: 'Lola Protar',
        electros: 'Charlotte Davy, Léo Aguiton, Lois Blanchard, Clara Bodino, Clémentine Jahan, Théo Sury',
        chefMachino: 'Guillaume Grandin',
        machinos: 'Morgan Dandre, Lilian Clement',
        regisseur: 'Theo Giliberto',
        thumbnail: '/images/ziak-feng-shui-thumb.jpg',
        images: [],
        youtubeId: 'elI5iDHsSGI',
        production: 'Facteur Humain × 29 Studio',
        // Extraits : expérimentations Insta du réal + clip (version YouTube 1080p, sous-titres recadrés)
        extraits: {
          titre: 'Extraits',
          lien: 'https://www.instagram.com/p/DbYjL_gAD0B/',
          lienTexte: 'Les expérimentations de Facteur Humain sur Instagram',
          // Expérimentations du réal (Insta) d'abord, puis les plans du clip
          videos: [
            ...[1, 2, 3, 4].map((n) => `/videos/ziak/ziak-insta-${n}`),
            ...[2, 1, 3, 4, 5].map((n) => `/videos/ziak/ziak-${n}`),
          ],
        },
        description: 'Clip tourné au Studio Kremlin pour le morceau Feng Shui (prod. Focus Beatz & JY). Dispositif studio construit autour d\'un travelling circulaire, avec une lumière entièrement pilotée au pupitre.',
        specs: {
          format: 'Clip',
          duree: '2min40',
          jours: '1 jour (prélight et tournage)',
          tournage: 'Avril 2026',
          lieu: 'Studio Kremlin, Ivry-sur-Seine',
          lumiere: '12 Vortex 8, 12 Astera AX9, 4 Nanlux 900c, SkyPanel S60, Aputure 600, Astera Pluto, 12 Esprite',
          particularite: 'Travelling circulaire, lumière au pupitre',
        }
      },
      {
        id: 'nothing-personal',
        title: 'Nothing Personal',
        year: '2026',
        month: 'Juin 2026',
        role: 'Électricien',
        realisateur: 'Jean De Raissac',
        premierAssReal: 'Flora Mollier',
        secondAssReal: 'Max Menut',
        script: 'Hugo Pederencino & Marion Dupont',
        chefOp: 'Emma Deporte',
        assistantCam: 'Noémie Werquin, Morgan Noël & Lyne Goma-goma',
        chefElectro: 'Virgile Vermeulen',
        electros: 'Théo Sury, Louise Mariesant, Lou Cassot & Alice Urso',
        machino: 'Clément Simonnot',
        son: 'Sophie Derimian & Sasha Stalnikiewicz',
        maquillage: 'Justine Jouveneaux',
        accessoiriste: 'Romain Colard',
        deco: 'May-Linh Dujardin & Nathan Despringre-Baveye',
        photo: 'Elliott Biget',
        regisseur: 'Aliénor Tellier',
        assistRegie: 'Oscar Biget & Yann Machet',
        thumbnail: '/images/placeholder-thumb.jpg',
        status: 'En post-production',
        images: [],
        description: 'Deux hommes de main, Micka et Vincent, font halte près d\'un centre équestre abandonné avec un otage dans le coffre. Micka, très fier de sa veste en cuir, a surtout envie de discuter.\n\nCourt-métrage étudiant tourné dans le Nord.',
        specs: {
          format: 'Court-métrage fiction',
          jours: '6 jours',
          tournage: 'Juin 2026',
          lieu: 'Club Hippique du Forest, Bondues (Nord)',
        },
        cast: [
          'Hakim Hachouche (Micka)',
          'Edgar Dias (Antoine)',
          'Charly Potter (Vincent)',
        ]
      },
      {
        id: 'moutarderie-fallot-vr',
        title: 'Moutarderie Fallot : Expérience VR',
        year: '2026',
        month: 'Mai-Juin 2026',
        role: 'Électricien',
        realisatrice: 'Corinne Planchais',
        production: 'Drôle de Trame',
        producteur: 'Claire Lebouteiller',
        premierAssReal: 'Carole Reinhard',
        chefOp: 'Nicolas Le Gal',
        chefElectro: 'Renaud Bertrand',
        electros: 'Théo Sury',
        son: 'Julien Chaumat',
        directionArtistique: 'Dominique Vidal',
        deco: 'Louna Legal',
        accessoiriste: 'René Charles Despré (construction)',
        costume: 'Dominique Vidal, assistée d\'Axelle Roux',
        maquillage: 'Géraldine Geretier',
        vfx: 'Martial Brard & Charlotte Didier (3D), Julien Brard (post-production 3D)',
        thumbnail: '/images/moutarderie-fallot-thumb.webp',
        status: 'En post-production',
        images: [],
        description: 'Docu-fiction en réalité virtuelle commandée par la Moutarderie Fallot, qui retrace la fabrication traditionnelle de la moutarde. Tourné intégralement sur fond vert en studio, en caméra 360, sous la supervision VR de Michael Kolchesky. Décors reconstitués en 3D : atelier de fabrication, grenier et atelier de conditionnement.',
        specs: {
          format: 'Docu-fiction VR 360',
          jours: '4 jours',
          lieu: 'Studio Jours Tranquilles, Clichy',
          tournage: 'Mai-Juin 2026',
          particularite: 'Fond vert intégral, caméra 360, décors 3D'
        },
        cast: [
          'Pascal Vannson (Edmond Fallot)',
          'Hugues Duchêne (Émile Faivre)',
          'Jean-Christophe Quenon (Le rhabilleur de meule)',
          'Delphine Raoult (Julie)',
          'Stéphanie Labbé (La moutardière)',
          'Jean-Jacques Boutin (Le moutardier)',
          'Axelle Roux (Denise)',
          'Sylvia Conti (Ouvrière conditionnement)'
        ]
      },
      {
        id: 'cache-toi-cest-mon-pere',
        accessoiriste: 'Anaïs Bordessoules',
        costume: 'Perline Gibouin',
        steadicam: 'Grimaud Menu',
        title: 'Cache-toi, c\'est mon père !',
        year: '2026',
        month: 'Mai 2026',
        role: 'Chef électricien',
        realisateur: 'Lucien Duléry',
        producteur: 'Lucien Duléry',
        premierAssReal: 'Gibril Kherroubi',
        secondAssReal: 'Nicolas Quintin',
        script: 'Emma Herrero-Boué',
        chefOp: 'Maxime Guérin',
        assistantCam: 'Paco Bernier & Antonin Leclere',
        chefElectro: 'Théo Sury',
        electros: 'Clara Bodino, Mattéo Mercat, Laura Jacquet-Crétides, Sacha Bonte & Clovis Belleil',
        son: 'Adrian Xavier',
        deco: 'Anaïs Bordessoules',
        maquillage: 'Audrey Brugnerotto',
        regisseur: 'Quentin Dissard',
        thumbnail: '/images/placeholder-thumb.jpg',
        status: 'En post-production',
        images: [],
        description: 'Court-métrage tourné à Vincennes et à Paris, en décors naturels : un appartement, une rue et un restaurant.',
        specs: {
          format: 'Court-métrage fiction',
          jours: '4 jours',
          tournage: 'Mai 2026',
          lieu: 'Vincennes, Fontenay-sous-Bois & Paris',
        },
        cast: [
          'Jeanne Richard (Léa)',
          'Lucien Duléry (Théo)',
          'Antoine Duléry (Christophe, le père)',
          'Pascale Pouzadoux (Sandra)',
          'Ian Herscovici (Le serveur)',
          'Alexandre Maître (Le maître d\'hôtel)'
        ]
      },
      {
        id: 'bureau-du-karma',
        boucles: [1, 4].map((n) => `/videos/boucles/bureau-du-karma-${n}`),
        boucleRatio: '1200 / 676', // format des extraits (bandes noires retirées)
        title: 'Bureau du Karma',
        year: '2026',
        month: 'Mai 2026',
        role: 'Chef électricien',
        realisateur: 'Julien Millet',
        production: 'Drôle de Prod',
        producteur: 'Ava Canault',
        premierAssReal: 'Angèle Vitani',
        script: 'Astea Dachez',
        chefOp: 'Quentin Ribeyrol',
        assistantCam: 'Denez Pithois',
        secondAssistantCam: 'Roxane Delcampe',
        chefElectro: 'Théo Sury',
        electros: 'Léo Aguiton',
        son: 'Enzo Brinckmann',
        soundDesign: 'Enzo Brinckmann',
        musique: 'Enzo Brinckmann',
        deco: 'Valentine Simonin',
        maquillage: 'Auriane Charroing',
        monteur: 'Julien Millet',
        etalonneur: 'Quentin Ribeyrol',
        graphisme: 'Julien Millet',
        thumbnail: '/images/bureau-du-karma-thumb.jpg',
        images: [],
        videoFile: '/videos/bureau-du-karma.mp4',
        description: 'Court-métrage d\'une minute réalisé pour le festival 1 minute 1 court, où il a été diffusé sous le numéro 35. Dans un bureau administratif d\'un autre âge, on tamponne les sentences karmiques.\n\nPrix du scénario au festival 1 minute 1 court.',
        specs: {
          format: 'Court-métrage (festival 1 minute 1 court)',
          duree: '1min00',
          jours: '1 jour',
          tournage: 'Mars 2026',
          lieu: 'Cité Paradis, Paris 10e',
          camera: 'Sony FX6',
          objectifs: 'Zeiss Vintage (PS-Technik) et Laowa 24 mm Macro',
        },
        cast: [
          'Alexandre Guilbaud (Le Chef)',
          'Boris Bégard (Charles)',
          'Florian Velasco (L\'Influenceur)',
          'Agathe Mourier (L\'Influenceuse)',
          'Hakim Hachouche (Cascade)',
          'Louise Daquin (Cascade)'
        ]
      },
      {
        id: 'trauma-resonance',
        masque: true, // caché pour une grille de tuiles symétrique (4 x 4), à remettre si besoin
        title: 'Trauma Résonance',
        year: '2026',
        month: 'Avril 2026',
        role: 'Électricien',
        realisateur: 'Kenji Isidor',
        producteur: 'Kenji Isidor',
        prodExec: 'Axelle Derudder',
        premierAssReal: 'Sébastien Arroux',
        secondAssReal: 'Elodie Noir',
        script: 'Mélissa Micic',
        chefOp: 'Léo Merchadou',
        assistantCam: 'Julia Fetouaki',
        chefElectro: 'Léo Aguiton',
        electros: 'Guilhem Leroux & Théo Sury',
        son: 'Sacha Benoit',
        costume: 'Sören Cozette',
        maquillage: 'Anaé Delmas & Margaux Prigent',
        deco: 'Morgane Bourdeau, Ramla Cherni, Léon Chauvet, Emma Navarrete & Hélène Powell-Smith',
        photo: 'Ninon Dabos & Aryane Nassirian Shehni',
        regisseur: 'Jonathan Francillette',
        assistRegie: 'Emilien Rouillard & Thomas Raoult',
        thumbnail: '/images/placeholder-thumb.jpg',
        status: 'En post-production',
        images: [],
        description: 'Court-métrage tourné à Paris, en partie dans un décor d\'hôpital reconstitué.',
        specs: {
          format: 'Court-métrage fiction',
          jours: '5 jours',
          tournage: 'Avril 2026',
          lieu: 'Paris & Choisy-le-Roi',
        },
        cast: [
          'Paola Benigni (Angela)',
          'Axelle Derudder (Barbara)',
          'Rachel Carlhian (Cassandra)'
        ]
      },
      {
        id: 'mode-kids',
        boucles: [1, 2].map((n) => `/videos/boucles/mode-kids-${n}`), // extraits muets enchaînés dans la grille
        boucleRatio: '1200 / 676', // format des extraits (bandes noires retirées)
        title: 'Mode Kids',
        year: '2025',
        month: 'Novembre 2025',
        role: 'Chef électricien',
        realisatrice: 'Ania Mokrani',
        production: 'AV Prod',
        producteur: 'Capucine Joveneaux (cheffe de projet)',
        directionArtistique: 'Martin Ducrot',
        chefOp: 'Alexis Cibille',
        chefElectro: 'Théo Sury',
        son: 'Mattheus Paganini',
        perchman: 'Mattheus Paganini',
        thumbnail: '/images/mode-kids-thumb.jpg',
        images: [],
        vimeoIds: [
          // Intégration désactivée côté AV Prod (le player renvoie 401).
          // À réactiver dans les réglages Vimeo de la vidéo pour qu'elle s'affiche.
          {
            id: '1165686017',
            title: 'Mode Kids : quand les enfants prennent le plateau'
          },
          {
            id: '1155080309',
            hash: 'f95abed7e0',
            title: 'Mode Mum & Kid'
          }
        ],
        description: 'Deux films publicitaires tournés en studio pour valoriser des collections de mode enfant. Le premier place les enfants dans les rôles de l\'équipe technique (réalisateur, cadreur, styliste) et fait du tournage lui-même le décor. Le second met en scène la relation parent-enfant sur fonds colorés.',
        specs: {
          format: 'Publicité (2 films)',
          duree: '48s et 31s',
          jours: '1 jour (installation la semaine précédente)',
          tournage: 'Novembre 2025',
          lieu: 'Grand Plateau du 14, Marquette-lez-Lille',
        }
      },
      {
        id: 'super-vespapa',
        diaporama: [1, 4, 5, 10].map((n) => `/images/super-vespapa-plateau/vespapa-plateau-${n}.jpg`), // fondu dans le défilé (backstage, pas d'images du film)
        diaporamaRatio: '3 / 2', // format des photos : la carte s'y adapte, rien n'est recadré
        title: 'Super Vespapa',
        year: '2026',
        month: 'Juin 2026',
        role: 'Chef-opérateur / Co-scénariste',
        realisatrice: 'Lou Cassot',
        scenariste: 'Lou Cassot & Théo Sury, sur une idée originale de Lou Cassot',
        production: 'MM Production',
        // Photos de plateau (tournage du 17 au 21 juin 2026)
        plateau: {
          titre: 'Sur le plateau',
          lien: 'https://www.instagram.com/p/DdsJOMvDG0q/',
          credit: 'Arthur Cassot',
          photos: Array.from({ length: 10 }, (_, i) => `/images/super-vespapa-plateau/vespapa-plateau-${i + 1}.jpg`),
        },
        producteur: 'Lou Cassot, Théo Sury & Marie Caus (production déléguée)',
        dirProd: 'Odessa Lemaire & Marie Caus',
        premierAssRealPrepa: 'Hélène Pottier',
        premierAssReal: 'Gibril Kherroubi',
        secondAssReal: 'Cassandra Dubois & Marie Caus',
        script: 'Salomé Renard',
        chefOp: 'Théo Sury',
        assistantCam: 'Maxime Lahaye',
        secondAssistantCam: 'Maria Trohel',
        chefElectro: 'Guilhem Leroux',
        electros: 'Clément Simonnot & Virgile Vermeulen',
        chefMachino: 'Tom Daniel',
        son: 'Faustin Lesage',
        cheffeDecoratrice: 'Alice Drocourt',
        accessoiriste: 'Alice Drocourt',
        costume: 'Holly Lemaitre',
        maquillage: 'Maxence De Vendt',
        regisseur: 'Anne-Laure Lepers',
        assistRegie: 'Lilou Sanchez-Boussekey & Marie Lecocq',
        monteur: 'Kendra Tarby',
        graphisme: 'Paul Blanchet (motion design)',
        photo: 'Arthur Cassot',
        thumbnail: '/images/super-vespapa-thumb.webp',
        status: 'En post-production',
        images: [],
        description: 'Guy n\'a plus parlé à grand-monde depuis un an. Sa fille Lise est venue passer une semaine chez lui. La balade en Vespa qu\'il lui a promise, il n\'y arrive pas cet après-midi-là. Au dîner, la dispute éclate, et Lise comprend qu\'elle l\'a peut-être perdu. Cette nuit-là, seul dans sa cuisine, il repose son verre dans l\'évier. Au matin, le scooter est dans l\'allée. Super Vespapa est l\'histoire d\'un père qui lutte contre lui-même, pour sa fille.',
        specs: {
          format: 'Court-métrage fiction',
          jours: '5 jours',
          tournage: 'Juin 2026',
          lieu: 'Écourt-Saint-Quentin (Pas-de-Calais)',
          camera: 'ARRI Alexa Mini',
        },
        cast: [
          'Thomas Dubois (Guy)',
          'Clémentine Chatard (Lise)',
          'Michel Maseiro (Le garagiste)'
        ]
      },
      {
        id: 'the-right-choice',
        // Un seul plan du tunnel (1) : arche dans la fumée, pyro, contre-jour, fumée rouge
        // (pas le plan du mannequin : lumière qui n'est pas de Théo)
        boucles: [6, 1, 7, 2].map((n) => `/videos/boucles/the-right-choice-${n}`), // extraits muets enchaînés dans la grille
        boucleRatio: '1920 / 1080',
        title: 'The Right Choice',
        artiste: 'meysi',
        year: '2026',
        month: 'Mars 2026',
        role: 'Chef électricien',
        youtubeId: 'FxcGjst68kY',
        realisateurs: 'Lole Girard, Arthur Monville & meysi',
        production: 'Stuzka',
        chefOp: 'Evans Lecocq',
        assistantCam: 'Maria Trohel',
        chefElectro: 'Théo Sury',
        electros: 'Lune Pille & Virgile Vermeulen',
        monteur: 'n9ne',
        etalonneur: 'cnjsii',
        stylisme: 'Eliette Pessemier',
        thumbnail: '/images/i-have-enough-thumb.jpg',
        images: [],
        description: 'Clip de meysi, produit par l\'association Stuzka (tourné sous le titre de travail « I Have Enough »). Tunnel, hangar et piste d\'aviation dans la brume : fumigènes et pyrotechnie.',
        specs: {
          format: 'Clip',
          duree: '2min30',
          jours: '3 jours',
          tournage: 'Mars 2026',
          lieu: 'Usine désaffectée à Sequedin, tunnel et aérodrome de Merville',
          particularite: 'Fumigènes et pyrotechnie, lumière sur batteries Instagrid, sans groupe électrogène',
        }
      },
      {
        id: 'lettre-a-lille',
        title: 'Lettre à Lille',
        year: '2026',
        month: 'Mars 2026',
        role: 'Cadreur / Assistant caméra',
        realisatrice: 'Fanny Caillibot',
        production: 'Galaxie Presse pour France 3 Région',
        producteur: 'Eric Quintin',
        prodExec: 'Karine Sevrain',
        assistProd: 'Ludivine Vongsavath Urtin & Jessy Mathiou',
        chefOp: 'Nicolas Le Gal',
        cadreur: 'Théo Sury',
        assistantCam: 'Théo Sury',
        thumbnail: '/images/placeholder-thumb.jpg',
        status: 'En post-production',
        images: [],
        description: 'Documentaire tourné à Lille et dans la métropole : chez une habitante, le long de la Deûle, au marché de Wazemmes, dans une friperie et au Casino Barrière lors d\'un dîner-spectacle.',
        specs: {
          format: 'Documentaire',
          jours: '3 jours',
          tournage: 'Mars 2026',
          lieu: 'Lille et métropole',
          camera: 'Panasonic EVA1 & Lumix S1H',
          particularite: 'HD 1080 25p, S-Log3, son direct sur caméra',
        }
      },
      {
        id: 'la-table-regie',
        electros: 'Loïs Blanchard & Corentin Claeysen',
        title: 'La Table Régie',
        year: '2026',
        month: 'Avril-Octobre 2026',
        role: 'Chef électricien',
        realisateur: 'Théo Carlier',
        chefOp: 'Léo Aguiton',
        thumbnail: '/images/placeholder-thumb.jpg',
        status: 'En post-production', // tournage terminé en octobre 2026
        images: [],
        // Installations lumière des blocs 4 et 5 (le réalisateur accepte que les techniciens partagent des images)
        plateau: {
          titre: 'Sur le plateau',
          credit: 'Théo Sury',
          photos: [1, 2, 3, 4, 5, 6].map((n) => `/images/la-table-regie-plateau/ltr-plateau-${n}.jpg`),
        },
        description: 'Court-métrage tourné en cinq blocs. Électricien sur le prélight du premier bloc, puis chef électricien sur les blocs 4 et 5.',
        specs: {
          format: 'Court-métrage fiction',
          jours: '5 blocs (prélight du bloc 1, chef électro sur les blocs 4 et 5)',
          lieu: 'Studios de la Montjoie, Saint-Denis',
        }
      },
      {
        id: 'vedette',
        boucles: [1, 5, 4, 2, 3].map((n) => `/videos/boucles/vedette-${n}`), // 2 : le travelling dans le décor
        boucleRatio: '1200 / 600', // format des extraits (bandes noires retirées)
        title: 'Vedette !',
        year: '2024',
        month: 'Février-Mars 2024',
        role: 'Chef-opérateur / Cadreur',
        realisateurs: 'Augustin Provost & Konrad Galice',
        production: 'ESEC',
        premierAssReal: 'Ana Maria Garza & Luce Paz',
        secondAssReal: 'Adriana Julio & Tristan Lonné',
        troisiemeAssistantReal: 'Arthur Couraud',
        scripte: 'Enzo Faider & Souleym Minneart',
        directionArtistique: 'Albane Lecomte & Luce Paz',
        renfortDeco: 'Adriana Julio, Sibylle Hoymans, Sacha Harassi, Alice Granier, Alice Drocourt, Anaïs Taane & Takemi Louvel',
        chefOp: 'Théo Sury & Isaac Gorin',
        cadreur: 'Isaac Gorin & Théo Sury',
        assistantCam: 'Adam Bentalha & Ana Maria Garza',
        secondAssistantCam: 'Mado Filippi Latour',
        chefElectro: 'Albane Lecomte & Sonia Southwood',
        electros: 'Jukaï Couturier, Guilhem Leroux & Marion Cros',
        chefMachino: 'Maxence Lebreton & Mateo Reynal',
        machino: 'Thomas Correia Gomes & Maxence Lebreton',
        son: 'Souleym Minneart & Adam Bentalha',
        perchman: 'Enzo Faider & Sonia Southwood',
        maquillage: 'Camille Manarin',
        monteur: 'Juliette Lelanno',
        etalonneur: 'Marion de Ravel de l\'Argentière',
        mixage: 'Elisa Guezala',
        thumbnail: '/images/vedette-thumb.jpg',
        images: [],
        youtubeId: 'huDt5YegK_k',
        description: 'Claude, une ancienne vedette en déclin, se bat avec le réalisateur pour tourner une scène romantique avec sa co-star Olivia Ricci. Il regrette alors son souhait lorsqu\'il découvre qu\'Olivia est en réalité sa fille, mais le réalisateur est décidé à lui faire tourner cette scène et Olivia est bien décidée à lui faire regretter son abandon de responsabilité paternel.',
        synopsis: 'Pastiche des années 50 tourné en studio. Deux ambiances distinctes : le "film dans le film" avec un éclairage doux très studio, dolly et longues focales, et la partie "hors du film" très contrastée, en plans fixes stricts au 18mm.',
        specs: {
          format: 'Court-métrage fiction',
          duree: '14min08',
          jours: '2 jours',
          tournage: 'Février-Mars 2024',
          lieu: 'Studio de l\'ESEC, Paris 12e',
          camera: 'Arri ALEXA SXT Plus',
          objectifs: 'Cooke S4',
        },
        cast: [
          'Gilbert Coudurier (Claude Berr)',
          'Luna Kozaczka (Olivia Ricci)',
          'Stéphane de Oliveira (Réalisateur)',
          'Eric Sequert (Agent)',
          'Louise Depardieu (Scripte)',
          'Basile Argant (Matuschak)',
          'James Cole (Producteur)',
          'Yannick Canton (Assistant réal)'
        ]
      },
      {
        id: 'vagues',
        boucles: [17, 15, 21, 18, 20, 22, 4].map((n) => `/videos/boucles/vagues-${n}`), // extraits muets enchaînés dans la grille
        boucleRatio: '1200 / 500', // format des extraits (bandes noires retirées)
        // Pas de plans sur fond de ciel gris seul, ni la trompette (l'équipe s'y reflète)
        // 17 : la valse (les mains en longue focale, puis le plan large), 15 : Pablo face à la mer, 18 : la course entière, de la mer à la plage,
        // 20 : le baiser au crépuscule, 21 : la trompette en très gros plans, 22 : le trompettiste sur la plage.
        // Que des plans de cinéma marquants et variés (pas d'intérieurs sur Alice)
        title: 'Ce que laissent les vagues',
        year: '2024',
        month: 'Avril 2024',
        role: 'Cadreur',
        realisatrices: 'Luce Paz & Ana Maria Garza Flores',
        scenariste: 'Lou Argenti',
        production: 'ESEC',
        dirProd: 'Quentin Lautier',
        assistProd: 'Apolline Vintrou',
        regisseur: 'Maya Davy',
        assistRegie: 'Margot Payer',
        premierAssReal: 'Albane Lecomte',
        secondAssReal: 'Sibylle Hoymans (prépa) & Tristan Lonné',
        scripte: 'Souleym Minnaert',
        chefOp: 'Isaac Gorin',
        cadreur: 'Théo Sury',
        assistantCam: 'Sibylle Hoymans',
        directionArtistique: 'Adam Bentalha',
        deco: 'Alice Drocourt & Sasha Harrassi',
        costume: 'Virginie Courteille',
        son: 'Ferdinand Barrau',
        perchman: 'Baptiste Fauvel',
        chefElectro: 'Augustin Provost',
        chefMachino: 'Konrad Galice',
        electros: 'Guilhem Leroux & Morgan Brun',
        maquillage: 'Camille Manarin',
        choregraphe: 'Maryam Taheri',
        monteur: 'Marion de Ravel de l\'Argentière',
        mixage: 'Elio Del Monaco',
        etalonneur: 'Simon Neylan',
        thumbnail: '/images/vagues-thumb.jpg',
        images: [],
        youtubeId: 'BC1k5pwd-_8',
        description: 'Pablo est un gitan qui vit seul près de la mer. Ce lieu est devenu son refuge depuis ses 19 ans, âge auquel il est tombé amoureux de son unique amour, Alice, avant de la perdre tragiquement cette même année. Forcé de quitter le seul endroit où il a vu son bonheur, il replonge dans ses souvenirs comme pour plonger avec Alice, la retrouver, quitte à ne plus en émerger.',
        synopsis: 'Deux époques se confrontent : un présent sombre et désaturé face à un passé chaud aux couleurs vives. Tournage en Bretagne avec Easyrig pour suivre les mouvements des personnages sur la plage. Plans dynamiques et sensoriels pour traduire la mémoire de Pablo.',
        specs: {
          format: 'Court-métrage fiction',
          duree: '12min44',
          jours: '5 jours',
          tournage: 'Avril 2024',
          lieu: 'Presqu\'île de Rhuys (Saint-Gildas-de-Rhuys, Arzon), Morbihan',
          camera: 'Arri ALEXA SXT Plus',
          objectifs: 'Cooke S4',
          cadrage: 'Easyrig',
        },
        cast: [
          'Ambryn Guedin (Pablo Jeune)',
          'Audrey Bauer (Alice)',
          'Joel Perruch (Pablo Vieux)',
          'Prune Lichtlé (Mère d\'Alice)',
          'Marc Caballero (Père de Pablo)',
          'Benjamin Court (Père d\'Alice)',
          'Sandrine Laverdure (Mère de Pablo)',
          'Loukas Chillaud (Benoit)',
          'Loic Hays (Maire)',
          'Yann Chapus (Pêcheur)',
          'Morgan Brun (Gitan)'
        ]
      },
      {
        id: 'casse-cest-casse',
        chefMachino: 'Roman Popsing',
        boucles: [1, 2, 3].map((n) => `/videos/boucles/casse-cest-casse-${n}`), // extraits muets enchaînés dans la grille
        boucleRatio: '1200 / 676', // format des extraits (bandes noires retirées)
        title: 'Cassé c\'est Cassé',
        year: '2026',
        month: 'Février 2026',
        role: 'Électricien',
        artiste: 'Wallace Cleaver',
        realisateur: 'Romain Habousha',
        production: '29 Studio',
        producteur: 'Jim Schachmes',
        directriceProd: 'Tosca Poilliot',
        regisseurGeneral: 'Bastien Rousseau',
        assistantReal: 'Jules Dormoy',
        chefOp: 'Aïlé Mandé',
        assistantCam: 'Aurélien Desjardin',
        secondAssistantCam: 'Tristan Vauvert & Sarah Francisco',
        chefElectro: 'Maxime Chastres',
        electros: 'Kyllian Bouvet, Nathan Leblanc, Loïs Blanchard & Théo Sury',
        machino: 'Philippe de Vitry',
        deco: 'Anaïs Profit, Avril Lecoq, Léa Morel, Tiphaine Dupré De Puget, Gabriel Laville, Victor Jobard, Robin De Dieuleveult & Pauline Petit',
        stylisme: 'Jordan Curti',
        maquillage: 'Claire Villard',
        vfx: 'Jonas Brisé',
        sfxArtifices: 'Mehdi Hamza',
        description: 'Clip tourné au Studio Kremlin à Ivry-sur-Seine.\n\nRéal : Romain Habousha\nChef-opérateur : Aïlé Mandé\nChef électricien : Maxime Chastres',
        thumbnail: '/images/casse-cest-casse-thumb.jpg',
        images: [],
        youtubeId: 'GeE6Sa8rlDI',
        specs: {
          format: 'Clip',
          duree: '3min19',
          jours: '2 jours',
          tournage: 'Février 2026',
          lieu: 'Studio Kremlin (Petite Halle), Ivry-sur-Seine',
        },
      },
      {
        id: 'pub-vs-ia',
        title: 'Et ils vécurent sans ami·es',
        year: '2026',
        month: 'Avril 2026',
        role: 'Électricien',
        realisatrice: 'Alice Vaillant',
        production: 'L\'Autre Rive Productions',
        producteur: 'Mathilde Mokhtari (productrice déléguée et exécutive)',
        assistantReal: 'Gibril Kherroubi',
        chefOp: 'Mary Wolf',
        steadicam: 'Émilie Palet',
        assistantCam: 'Maxence Riffat & Audrey Goudin',
        chefElectro: 'Basile Berthou',
        electros: 'Jean-Baptiste Rime & Théo Sury',
        son: 'Matin Jalali',
        costume: 'Emma Lévêque',
        deco: 'Esther Torsiello',
        photo: 'Emeric Gallego',
        monteur: 'Estefania Gagey',
        vfx: 'Ewan Ros',
        etalonneur: 'Christophe Chemin',
        // Le film n'est pas diffusé publiquement pendant les festivals : images partagées par la prod sur Instagram
        images: [1, 2, 3, 4, 5].map((n) => `/images/pub-vs-ia/film-${n}.jpg`),
        plateau: {
          titre: 'Sur le plateau',
          credit: 'Théo Sury',
          photos: [1, 2, 3].map((n) => `/images/pub-vs-ia/plateau-${n}.jpg`),
        },
        thumbnail: '/images/pub-vs-ia-thumb.jpg',
        description: 'Lors d\'une cérémonie de mariage, le témoin du marié se révèle être un collier chatbot IA. Pour tous les invités, la situation semble parfaitement normale. Seul le prêtre semble troublé. Au moment de la signature des témoins, le « témoin » se retrouve évidemment dans l\'incapacité de signer…\n\nImages du film : L\'Autre Rive Productions. Actuellement en festivals.',
        specs: {
          format: 'Court-métrage (spot)',
          jours: '1 jour',
          lieu: 'Église Saint-Luc, Paris',
          tournage: 'Avril 2026',
        },
        cast: [
          'Nadia Mechaheb',
          'Christophe Som',
          'Ouerdia Taleb',
          'Eric Fardeau',
        ]
      },
      {
        id: 'marcus',
        title: 'Marcus',
        year: '2026',
        month: 'Octobre 2026',
        role: 'Électricien (prélight)',
        realisateur: 'Jules Devoise',
        production: 'La Radieuse × Volt & Picseyes',
        prodExec: 'Romain Ferreira',
        assistantReal: 'Guillaume Bosteau',
        script: 'Julia Nogueira',
        electros: 'Simon Clarisse, Diego Galuteau, Clothilde Barbier, Julie Puel, Théo Frachon, Arthur Flavini & Théo Sury (prélight)',
        thumbnail: '/images/placeholder-thumb.jpg',
        status: 'En post-production',
        images: [],
        description: 'Marcus s\'interpose quand deux hommes s\'en prennent à Hedda à la sortie d\'un club.\n\nCourt-métrage tourné aux studios de la Montjoie, dans des décors construits pour le film. Trois jours de prélight sur une grosse installation au grill : une boîte à lumière immense et des lyres automatiques Proteus Maximus, pilotées par un pupitreur.',
        specs: {
          format: 'Court-métrage fiction',
          tournage: 'Octobre 2026',
          lieu: 'Studios de la Montjoie, Saint-Denis',
          lumiere: 'Boîte à lumière géante au grill, lyres Proteus Maximus',
          particularite: 'Décors studio construits pour le film, lumière au pupitre',
        },
        cast: [
          'Aurélien Jazosz (Marcus)',
          'Eve Bros (Hedda)',
          'Dimitri Decaux (Agresseur 1)',
          'Julien Marty (Agresseur 2)',
        ]
      },
      {
        id: 'nikon-mamie',
        title: 'Mamie',
        year: '2026',
        month: 'Octobre 2026',
        role: 'Électricien',
        realisatrice: 'Virginie Courteille',
        production: 'Nikon Film Festival',
        assistantReal: 'Marine Houé',
        script: 'Souleym Minn',
        chefOp: 'Léo Aguiton',
        assistantCam: 'Antoine Vérité & Isaac Camille-Jean',
        photo: 'Léo-Paul Pezza',
        chefElectro: 'Abel Duflo',
        electros: 'Théo Sury & Guilhem Leroux',
        son: 'Mattéo Comby',
        perchman: 'Fabiana Castronuovo',
        monteur: 'Raphaël Bailly',
        deco: 'Louise Ferauge',
        maquillage: 'Eleonora Covalet',
        regisseur: 'Alex Birot',
        thumbnail: '/images/nikon-mamie-thumb.jpg',
        status: 'En post-production',
        images: [],
        description: 'Court-métrage pour le Nikon Film Festival, l\'histoire la plus personnelle de Virginie Courteille. Tourné en trois jours dans une maison de Corbeil-Essonnes, avec une lumière pilotée au pupitre.',
        specs: {
          format: 'Court-métrage (Nikon Film Festival)',
          duree: '2min20',
          jours: '3 jours',
          tournage: 'Octobre 2026',
          lieu: 'Corbeil-Essonnes (Essonne)',
          camera: 'Sony FX6',
          particularite: 'Format 4/3, soleil tourné sous la pluie et pluie tournée au soleil',
        },
      },
      {
        id: 'nikon-vivi',
        masque: true, // titre « Mona » non confirmé : pas publié tant que ce n'est pas validé
        title: 'Mona',
        year: '2025',
        month: 'Novembre 2025',
        role: 'Électricien',
        realisatrice: 'Virginie Courteille',
        production: 'Nikon Film Festival',
        thumbnail: '/images/nikon-vivi-thumb.jpg',
        images: ['/images/nikon-vivi-1.jpg', '/images/nikon-vivi-2.jpg', '/images/nikon-vivi-3.jpg'], // photos de tournage
        description: 'Louis vit reclus dans sa chambre en désordre. En retrouvant une bande de photos, il se souvient de Mona, sa meilleure amie d\'autrefois.',
        specs: {
          format: 'Court-métrage (Nikon Film Festival)',
          duree: '2min20',
          jours: '2 jours',
          tournage: 'Novembre 2025',
          lieu: 'Paris',
          particularite: 'Thème du festival 2026 : « La Beauté »',
        },
      },
      {
        id: 'asterix',
        boucles: [3, 1, 2].map((n) => `/videos/boucles/asterix-${n}`),
        boucleRatio: '1200 / 676', // format des extraits (bandes noires retirées)
        title: 'Astérix',
        year: '2026',
        month: 'Janvier 2026',
        role: 'Réalisateur / Étalonneur',
        realisateurs: 'Théo Sury & Virgile Vermeulen',
        script: 'Théo Sury & Virgile Vermeulen',
        production: 'Genesix Prod',
        producteur: 'Aurélien Debergh',
        thumbnail: '/images/asterix-thumb.jpg',
        images: [],
        youtubeId: 'wucwrukZdhg',
        description: 'Deux jeunes, une dernière conversation. Il découvre qu\'il ne peut plus rien faire pour la retenir. Entre eux, quelque chose hésite encore. Astérix parle du moment où l\'intimité rend la place à la pudeur. Pas de cris, pas de reproches. Juste cette retenue immense entre deux personnes qui éprouvent encore une tendresse l\'une pour l\'autre.',
        etalonneur: 'Théo Sury',
        chefOp: 'Arthur Delebecque',
        son: 'Mattheus Paganni',
        mixage: 'Mattheus Paganni',
        monteur: 'Théo Sury',
        musique: 'Nina Dudek',
        assistantCam: 'Léo Wyrwinski',
        assistantSon: 'Émilien Sury',
        renforts: 'Lou Cassot & Thibaut Talman',
        conseillereMontage: 'Kendra Tarby',
        mastering: 'Victor Desfachelle',
        specs: {
          format: 'Court-métrage fiction',
          duree: '2min20',
          jours: '1 jour',
          lieu: 'Station Service Abandonnée',
          camera: 'Panasonic EVA-1',
          objectifs: 'Canon FD',
        },
        cast: [
          'Mina Dervesenne',
          'David Daudry',
        ]
      },
      {
        id: 'male-addict',
        title: 'Mâle Addict',
        year: '2025',
        month: 'Mars 2025',
        role: 'Chef-opérateur',
        realisateurs: 'Victoria Baverey & Pierre Vaxelaire',
        production: 'Cours Florent',
        dirProd: 'Sara-Ann Sullivan',
        premierAssReal: 'Sara-Ann Sullivan (prépa) / Margaux Josiaud (tournage)',
        secondAssReal: 'Antoine Pelé',
        script: 'Audrey Gauthreau',
        chefOp: 'Théo Sury',
        cadreur: 'Théo Sury',
        assistantCam: 'Isaac Gorin',
        secondAssistantCam: 'Lea Rumpler',
        chefElectro: 'Lothaire Girault',
        electros: 'Léo Augustin, Léo Aguiton & Angelo Beaubreuil',
        directriceArtistique: 'Virginie Courteille',
        assDirectriceArtistique: 'Alice Drocourt',
        costumiere: 'Manon Fantino',
        maquillage: 'Ines Eddoha & Julie Fortin',
        choregraphe: 'Sasha Pasetti',
        son: 'Matteo Comby',
        assistantSon: 'Yolen Le Coeur',
        regisseur: 'Bastien Bulle',
        assistRegie: 'Ming Saw & Paul Legendre',
        coordinatriceIntimite: 'Luce Paz',
        thumbnail: '/images/male-addict-thumb.jpg',
        status: 'En post-production',
        images: [],
        description: 'Triangle amoureux toxique entre Mathis, Thalia et Tom. Mathis et Thalia ont une liaison secrète alors que Thalia est en couple avec Tom, le meilleur ami de Mathis.',
        synopsis: 'L\'histoire explore la manipulation, la trahison et les conséquences d\'une relation destructrice entre trois jeunes adultes pris dans un jeu dangereux de désir et de mensonges.',
        specs: {
          format: 'Moyen-métrage fiction',
          duree: '40-50min (estimation)',
          jours: '11 jours',
          tournage: 'Mars-Avril 2025',
          lieu: 'Enghien-les-Bains & Cormeilles-en-Vexin (Val-d\'Oise)',
          camera: 'Blackmagic 6K',
        }
      },
      {
        id: 'undetoi',
        title: 'Un de Toi',
        year: '2026',
        month: 'Janvier 2026',
        role: 'Électricien',
        realisateur: 'Leila Pons',
        production: 'Université Paris 8',
        producteur: 'Elias Mahiedine',
        premierAssReal: 'Emile Giros',
        scripte: 'Adèle Narcy & Saif',
        regisseur: 'Snatch',
        chefOp: 'Quentin Ribeyrol',
        assistantCam: 'Camille Vaulon',
        chefElectro: 'Basile Berthou',
        electros: 'Théo Sury & Corentin Arès',
        son: 'Matthieu Fuchs',
        assistantSon: 'Louise Bride',
        deco: 'Mila Martineau & Jules Coquet',
        thumbnail: '/images/undetoi-thumb.jpg',
        status: 'En post-production',
        images: [],
        specs: {
          format: 'Court-métrage fiction',
          lieu: 'Appartement Parisien',
          tournage: 'Janvier 2026',
          camera: 'Sony FX9',
          particularite: 'Plans séquences / Travellings importants / Easyrig'
        },
        cast: [
          'Cleo Perrel',
          'Amine Rouba',
          'Paul Rainaut',
          'Selma Essaddani',
          'Eden Checco',
          'Laurent Richard',
          'Sania Mahi',
          'Léa Kopec',
          'Garance Vandeville',
          'Victoria Cazottes',
          'Majida Ghomari',
          'Sylvain Poulaud',
          'Barbara Augusseau'
        ]
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
        diaporama: [1, 2, 4, 3].map((n) => `/images/gate66-plateau/gate66-plateau-${n}.jpg`), // backstage, pas d'images du film
        diaporamaRatio: '3 / 2',
        // Photos de plateau (backstage, pas d'images du film)
        plateau: {
          titre: 'Sur le plateau',
          photos: [1, 8, 2, 9, 3, 4, 5, 6, 7].map((n) => `/images/gate66-plateau/gate66-plateau-${n}.jpg`),
        },
        images: [],
        specs: {
          format: 'Court-métrage',
          jours: '5 jours',
          tournage: 'Septembre 2025',
          lieu: 'Plaine Image, Tourcoing',
          camera: 'Alexa 35 / Sony A7S IV',
          objectifs: 'Cooke Varotal / Cooke S8/i FF',
          particularite: 'Dolly, machine à fumée, green screen',
        }
      },

      {
        id: 'bbc',
        coordProd: 'Nabawiya Ibrahima',
        premierAssReal: 'Élisa Cazelles',
        dirProd: 'Josi Frater',
        title: 'Brigade des Beaux Charmeurs',
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
          tournage: 'Août 2025',
          lieu: 'Romainville & Paris 16e',
          camera: 'Arri ALEXA 35',
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
        producteur: 'Solal Chomand',
        dirProd: 'Eva Gagnon',
        premierAssReal: 'Cyrielle Dagnicourt',
        secondAssReal: 'Arthur Monville',
        scripte: 'Jeannette Devendeville',
        regisseurs: 'Cécile Decroocq, Alice Lombard & Samuel Bénard',
        chefOp: 'Léo Salomé',
        assistantCam: 'Eve Ramseyer',
        secondAssistantCam: 'Maxime Lahaye',
        steadicam: 'Julien Néron',
        chefElectro: 'Loïc Latapie',
        chefElectroRenfort: 'Luc Desprez',
        electros: 'Théo Sury & Lou Cassot',
        chefMachino: 'Nathan Lebel',
        machino: 'Quentin Bril',
        son: 'Hugo Brient',
        assistantsSon: 'Samuel Beghin, Mattheus Paganini & Yanis Derouiche',
        cheffeDecoratrice: 'Cécile Paduch',
        deco: 'Camille & Olga Pleignet',
        accessoiriste: 'Emma Monnoyeur',
        costume: 'Camille Demaret',
        maquillage: 'Arya Bardin',
        photo: 'Astrid Joos-Deligne',
        thumbnail: '/images/verite-studio-thumb.jpg',
        status: 'En post-production',
        images: ['/images/verite_studio.jpg'], // photo de tournage (clap)
        // Synopsis d'après la page de financement participatif (Proarti)
        description: 'Film de La Fémis écrit et réalisé par Khadija Sy. Une mère et son fils tombent, sans le savoir, dans le piège de YouTubeurs. Quand la caméra cachée est dévoilée sur les réseaux, c\'est leur relation qui vacille.',
        specs: {
          format: 'Court-métrage fiction',
          jours: '5 jours et demi',
          tournage: 'Juillet 2025',
          lieu: 'LCR Les Tailleurs, Villeneuve-d\'Ascq',
          camera: 'Alexa 35',
          objectifs: 'Panavision Primo',
        },
        cast: [
          'Nathalie N\'Songan',
          'Aline Helan Boudon',
          'Baad-J',
          'Dulcineia Gomes',
          'Brahim Bouyan'
        ]
      },
      {
        id: 'azincourt',
        title: 'Azincourt',
        year: '2025',
        month: 'Octobre 2025',
        role: 'Électricien',
        realisateur: 'Adrien Guillet',
        premierAssReal: 'Maxime Le Breton',
        secondAssReal: 'Tanguy Ruckert',
        scripte: 'Enguerrand Noury',
        chefOp: 'Axel Dos Santos',
        cadreur: 'Etienne Muller',
        chefElectro: 'Alexandre Chadha',
        electros: 'Théo Sury & Mathieu Audouin',
        chefMachino: 'Mathieu Pascal Baujoin',
        son: 'Bertrand Pujol',
        chefHMC: 'Réjane Calvary',
        production: 'VHS Prod',
        thumbnail: '/images/azincourt-thumb.jpg',
        // 3 (768 px) écartée, trop petite, original introuvable (album partagé)
        diaporama: [2, 1, 4].map((n) => `/images/azincourt-plateau/azincourt-plateau-${n}.jpg`), // backstage, pas d'images du film
        diaporamaRatio: '3 / 2',
        status: 'En post-production',
        plateau: {
          titre: 'Sur le plateau',
          photos: [2, 1, 4].map((n) => `/images/azincourt-plateau/azincourt-plateau-${n}.jpg`), // 2400 px
        },
        images: [],
        specs: {
          format: 'Court-métrage',
          lieu: 'Château de la Lande, Montaigu-Vendée',
          tournage: 'Octobre 2025',
          camera: 'Alexa Mini LF',
          objectifs: 'Panavision Primo',
          particularite: 'Scènes de bataille, effets flèches 3D'
        }
      },
      {
        id: 'jugement-dernier',
        description: 'Clip du titre « Jugement Dernier » de Luca Flodrops. Traqué par cinq bourreaux, un condamné traverse une série de supplices, du bûcher à la forêt.',
        title: 'Jugement Dernier',
        year: '2025',
        month: 'Décembre 2025',
        role: 'Chef-opérateur',
        realisateurs: 'Matthis Geffroy & Luca Flodrops',
        artiste: 'Luca Flodrops',
        production: 'Make My Day, avec le soutien de Pictanovo',
        producteur: 'Nicolas Ossywa',
        chargeeProd: 'Myrtille Lakel',
        premierAssReal: 'Thibaut Beernaert',
        secondAssReal: 'Maelys Luciano',
        chefOp: 'Théo Sury',
        assistantCam: 'Maxime Lahaye',
        secondAssistantCam: 'Audrey Desriac',
        chefElectro: 'Lothaire Girault',
        electros: 'Lou Cassot & Guilhem Leroux',
        cheffeMachino: 'Maya Mahjoub',
        machinos: 'Tom Daniel & Anthony D\'Angelo',
        cheffeDecoratrice: 'Louna Miot',
        assistanteDecoratrice: 'Nina Bordey',
        costumiere: 'Marinette Houyelle',
        responsableSecurite: 'Anthony D\'Angelo',
        monteur: 'Eymeric Nicolas',
        vfx: 'Maël Gaumont',
        etalonneur: 'Alan Millet',
        monteurSon: 'Matthis Geffroy',
        thumbnail: '/images/jugement-dernier-thumb.jpg',
        diaporama: [1, 2, 4, 3].map((n) => `/images/jugement-dernier-plateau/jugement-dernier-plateau-${n}.jpg`), // backstage, pas d'images du film
        diaporamaRatio: '3 / 2',
        status: 'En post-production',
        plateau: {
          titre: 'Sur le plateau',
          photos: Array.from({ length: 6 }, (_, i) => `/images/jugement-dernier-plateau/jugement-dernier-plateau-${i + 1}.jpg`),
        },
        images: [],
        specs: {
          format: 'Clip',
          jours: '3 jours',
          tournage: 'Décembre 2025',
          lieu: 'Château du Bec, Saint-Martin-Du-Bec, Normandie',
          camera: 'RED Komodo X',
          objectifs: 'Atlas Mercury Anamorphiques',
          particularite: 'Scènes de torture, VFX',
        },
        cast: [
          'Luca Flodrops (Protagoniste)',
          'Augustin Hanriot (Bourreau)',
          'Pascal Labati (Bourreau)',
          'Tristan Kolmann (Bourreau)'
        ]
      },
      {
        id: 'armanaque',
        cast: [
          'Antoine Gourmelon (Alexis)',
          'Arnaud Wattine (Bastien)',
          'Emilien Ravel (Celyan)',
          'Emmanuelle Taton (Diane)',
          'Julie Van Rose (Flora)',
          'Camille Haddad (Garance)',
          'Maxence Bendjelloun (Henri)',
          'Lorenzo Blondet (Keran)',
          'Bastien Lapouille (Maeron)',
        ],
        boucles: [1, 4].map((n) => `/videos/boucles/armanaque-${n}`),
        boucleRatio: '1200 / 632', // format des extraits (bandes noires retirées)
        title: 'Armanaque',
        year: '2024',
        month: 'Juin 2024',
        role: 'Chef-opérateur',
        realisateur: 'Antoine Gourmelon',
        assistantReal: 'Luce Paz',
        secondAssistantReal: 'Tristan Lonne (en préparation) / Luce Paz (tournage)',
        script: 'Tristan Lonne (en préparation) / Luce Paz (tournage)',
        production: 'Auto-produit',
        producteur: 'Luce Paz & Antoine Gourmelon',
        regisseurGeneral: 'Vanina Nussbaumer',
        thumbnail: '/images/armanaque-thumb.jpg',
        images: [],
        description: 'Des amis d\'enfance ouvrent un bar en banlieue parisienne. Des concurrents locaux vont tout faire pour les empêcher de concrétiser leur rêve. Entre vols, secrets et jalousie, leur amitié résistera-t-elle à de telles tensions ?\n\nMoyen-métrage auto-produit, tourné en 2 semaines avec du matériel prêté par le Cours Florent et l\'ESEC.',
        synopsis: 'Lumière dure à contre-jour, soleil écrasant et zones cramées pour un rendu chaud et organique. Exploration du point de vue avec de nombreux champ-contre-champ, caméra au plus proche des personnages pour servir le ton comédie. Défi technique : moyen-métrage tourné en FS7 avec uniquement du tungstène.',
        youtubeId: 'gJY3ENECfbQ',
        chefOp: 'Théo Sury',
        assistantCam: 'Sibylle Hoymans',
        secondAssistantCam: 'Alice Drocourt',
        chefElectro: 'Noémie Routin, Léo Aguiton & Lothaire Girault',
        electros: 'Augustin Rabiller, Violette Boualam, Julie Rabreau, Margot Payer, Thomas Gomes, Marie Davain, Léo Augustin, Johanna Fabre & Isaac Gorin',
        machino: 'Alice Drocourt',
        costume: 'Virginie Courteille',
        deco: 'Louise Ferrauge',
        renfortDeco: 'Ninon Lorenzi',
        maquillage: 'Camille Manarin, Julie Salles & Athénaïs Domenge',
        son: 'Olivier Uléri & Marie Dublois',
        perchman: 'Olivier Uléri, Virginie Courteille & Alice Drocourt',
        specs: {
          format: 'Moyen-métrage fiction',
          duree: '45min52',
          jours: '2 semaines',
          tournage: 'Juin 2024',
          lieu: 'Paris, Cachan, Maisons-Alfort, Châtenay-Malabry, Le Plessis-Robinson, Maurepas',
          camera: 'Sony FS7',
          objectifs: 'Sony G Master',
          lumiere: 'Tungstène uniquement',
          budget: 'Très faible',
        }
      },
      {
        id: 'pardon',
        boucles: [4, 1, 3].map((n) => `/videos/boucles/pardon-${n}`),
        boucleRatio: '1200 / 1008', // format des extraits (bandes noires retirées)
        title: 'Pardon',
        year: '2024',
        month: 'Décembre 2024',
        role: '1er assistant caméra',
        realisatrice: 'Virginie Courteille',
        production: 'Nikon Film Festival',
        premierAssReal: 'Sara Hussey',
        scripte: 'Enzo Faider',
        chefOp: 'Isaac Gorin',
        cadreur: 'Morgan Brun',
        assistantCam: 'Théo Sury',
        chefElectro: 'Guilhem Leroux',
        electros: 'Léo Augustin & Jules Reiner Cammas',
        cheffeDecoratrice: 'Alice Drocourt',
        maquillage: 'Camille Manarin',
        son: 'Raphaël Guinaud',
        perchman: 'Mattéo Pereira',
        monteur: 'Raphaël Bailly',
        mixage: 'Mattéo Pereira',
        thumbnail: '/images/pardon-thumb.jpg',
        youtubeId: '9qQdzhmH8O0',
        specs: {
          duree: '2min19',
          format: 'Court-métrage',
          lieu: 'Paris',
          tournage: 'Décembre 2024',
          camera: 'Sony FX3'
        },
        cast: [
          'Eva Mostrou',
          'Nell Widmer',
          'Valentin Chemla',
          'Virginie Carillo',
          'Maxime Ragot',
          'Valentine Guedet'
        ]
      },
      {
        id: 'casse-noisette',
        boucles: [1, 4].map((n) => `/videos/boucles/casse-noisette-${n}`),
        boucleRatio: '1200 / 676', // format des extraits (bandes noires retirées)
        title: 'Casse-Noisette',
        year: '2024',
        month: 'Octobre 2024',
        role: 'Chef-opérateur',
        realisateur: 'Tristan Lonné',
        assistantReal: 'Virginie Courteille',
        scripte: 'Raphaël Bailly',
        chefOp: 'Théo Sury',
        cadreuse: 'Mado Filippi Latour',
        assistantCam: 'Isaac Gorin',
        secondAssistantCam: 'Lothaire Girault',
        chefElectro: 'Marion Cros',
        electros: 'Léo Aguiton & Guilhem Leroux',
        chefMachino: 'Alexandre Leickner',
        son: 'Raphaël Guinaud',
        perchman: 'Alexandre Birot',
        directionArtistique: 'Louise Ferauge',
        monteur: 'Raphaël Bailly',
        production: 'ESEC',
        thumbnail: '/images/casse-noisette-thumb.jpg',
        images: [],
        vimeoId: '1026723522',
        description: 'Court-métrage studio tourné en une journée lors des portes ouvertes de l\'ESEC. Carte blanche, style inspiré de The Office mais en plus malaisant.',
        specs: {
          format: 'Court-métrage',
          duree: '5min35',
          jours: '1 jour',
          tournage: 'Octobre 2024',
          lieu: 'Studio de l\'ESEC, Paris 12e',
          camera: 'Arri ALEXA Classic (SXT Plus)',
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
        boucles: [1, 2, 3, 4, 5].map((n) => `/videos/boucles/quand-son-souffle-${n}`),
        boucleRatio: '1200 / 676', // format des extraits (bandes noires retirées)
        title: 'Quand son souffle s\'est arrêté',
        year: '2024',
        month: 'Avril 2024',
        role: '2e assistant caméra',
        realisatrice: 'Nina Gavras',
        scenariste: 'Célia Leblois',
        production: 'ESEC',
        dirProd: 'Apolline Vintrou',
        assistProd: 'Quentin Lautier',
        regisseurGeneral: 'Anaïs Dorlean',
        regisseurs: 'Lucie Boutard',
        premierAssReal: 'Dalila De Siadjeu',
        secondAssReal: 'Noé Deza Dja',
        scripte: 'Fanny Hacot',
        casting: 'Tristan Lonné',
        chefOp: 'Léo Rodella',
        cadreur: 'Mateo Reynal',
        assistantCam: 'Sibylle Hoymans',
        secondAssistantCam: 'Théo Sury',
        chefElectro: 'Guilhem Leroux',
        electros: 'Emeline Japel & Lothaire Girault',
        chefMachino: 'Mado Filippi La Tour',
        son: 'Tristan Lonné',
        perchman: 'Alice Drocourt',
        directionArtistique: 'Anaïs Taane',
        maquillage: 'Marie Urbes',
        coiffure: 'Marie Urbes',
        monteur: 'Arsène Kuentz',
        mixage: 'Iscia Pecquet Delacrois',
        etalonneur: 'Rym Bouhedda',
        thumbnail: '/images/quand-son-souffle-thumb.jpg',
        images: [],
        youtubeId: 'epDfHUrlK_0',
        description: 'Eliot (20 ans) est un jeune homme atteint d\'autisme avec déficience intellectuelle. Lorsque sa soeur décède brutalement, ne comprenant pas la mort, il part à sa recherche. Film de fin d\'études ESEC.',
        specs: {
          format: 'Court-métrage fiction',
          duree: '10min19',
          jours: '2 jours',
          tournage: 'Avril 2024',
          lieu: 'Maisons-Laffitte',
          camera: 'Arri ALEXA Classic (SXT Plus)',
          objectifs: 'Cooke S4/i',
        }
      },
      {
        id: 'loverdance',
        boucles: [1, 2].map((n) => `/videos/boucles/loverdance-${n}`),
        boucleRatio: '1200 / 722', // format des extraits (bandes noires retirées)
        title: 'Loverdance',
        year: '2024',
        month: 'Juillet 2024',
        role: 'Régisseur adjoint',
        realisateur: 'Victor Gomez',
        assistantReal: 'Pedro Labaig',
        secondAssistantReal: 'Ariane Khusrawy',
        troisiemeAssistantReal: 'Loïc Aeschlimann',
        script: 'Pauline Latanska',
        scripte: 'Leya Bourgeois',
        casting: 'Andréa Goncalves',
        choregraphe: 'Sebastian Cuiza Galan',
        chefOp: 'Louise Bernard Pallas',
        cadreurB: 'Ludwik Pruzskowki & Nader Chalhoub',
        steadicam: 'Vinícius Mantovi',
        assistantCam: 'Louis Sciara, Tony Trépon, Alexia Figueira & Dania Rendano',
        chefElectro: 'Rémy Pigeard',
        electros: 'Simon Prentout, Alennas Djemli, Alexandre Laroche & Emeline Jeapel',
        chefMachino: 'Mahorie Haberkorn',
        machino: 'Justin Dermaux, Sebastian Obrecht, François Lambrez, Ronan Ledru & Shaline Haberkorn',
        son: 'Louise Lagabbe',
        assistantSon: 'Renaud Perret',
        maquillage: 'Maeliss Magdalena, Manon Antezak, Hanjing Sun & Manon Pellarin',
        deco: 'Julien Tognet & Lison Moret',
        regisseur: 'Gaël Frelau',
        assistRegie: 'Théo Sury',
        monteur: 'Tyliann Tondeur-Grozdanovitch',
        etalonneur: 'Ulysse Gaillot',
        producteur: 'Tommaso Cohen & Charles Tognet',
        production: 'Caïmans Productions',
        thumbnail: '/images/loverdance-thumb.jpg',
        images: [],
        description: 'Lola rencontre Simon lors d\'un marathon de 24 heures de danse. Alors que la compétition bat son plein, ils développent une complicité qui la détourne de son objectif. Mais les éliminations se succèdent à un rythme effréné et, à bout de souffle, elle décide de s\'unir à lui pour une danse qui pourrait bien les mener à la victoire…\n\nPrix Volpina au festival Amarcort de Rimini (2025), sélectionné au Corto Condorello (Rome) et au FlickerFest (Sydney).',
        vimeoId: '1025523467?autoplay=1&loop=1&autopause=0&player_id=0&app_id=58479&background=1',
        specs: {
          format: 'Court-métrage fiction',
          duree: '9min',
          jours: '5 jours',
          tournage: 'Juillet 2024',
          annee: '2024',
          camera: 'Alexa Mini LF',
          objectifs: 'Angénieux Style Optimo / ARRI Signature Zoom',
          diffusion: 'ARTE (Court-circuit, juin 2025) et SWR',
          pays: 'France / Allemagne',
          coproduction: 'Filmakademie Baden-Württemberg, La Fémis, ARTE, SWR',
        },
        cast: [
          'Louise Luck (Lola)',
          'Frederico Semedo (Simon)',
          'Yannick Blivet (Animateur)'
        ]
      },
      {
        id: 'insipide',
        boucles: [1, 8, 4, 7, 3].map((n) => `/videos/boucles/insipide-${n}`), // la couleur d'abord (La Fuite, fin de La Valse, Le Mépris), un plan noir et blanc pour finir
        boucleRatio: '1200 / 900', // format des extraits (bandes noires retirées)
        title: 'Insipide',
        year: '2022',
        month: 'Novembre 2022',
        role: 'Réalisateur',
        realisateur: 'Theo Sury',
        assistantReal: 'Manon Tellier',
        concept: 'Theo Sury, Solal Alenda & Mathilde Duquénoy',
        chefOp: 'Solal Alenda',
        assistantCam: 'Louis Juguet',
        electros: 'Aurélien Jean',
        maquillage: 'Pierre Canal & Marguerite Fermaut',
        monteur: 'Theo Sury',
        etalonneur: 'Solal Alenda',
        production: 'ESMOD',
        thumbnail: '/images/insipide-fuite-thumb.jpg',
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
        description: 'Création vidéo composée de trois clips, autour du projet de costumes néogothiques d\'étudiants de l\'école ESMOD.',
        synopsis: 'Trois univers distincts : La Valse (danse inquiétante), Le Mépris (tension solitaire), La Fuite (course éperdue).',
        specs: {
          format: 'Création vidéo',
          duree: '3 x 2min',
          pays: 'France',
          location: 'RVZ & Puzzle Video',
          camera: 'RED Komodo',
          objectifs: 'Zeiss Standard'
        },
        cast: [
          'La Valse : Ethan Wallevrick & Bill Tuan (Valseurs), Axel Lessieur (Angoisse)',
          'Le Mépris : Clothilde Merlin (Jeune fille), Axel Lessieur (Angoisse)',
          'La Fuite : Ariel Duquesne (Homme aux talons), Axel Lessieur (Angoisse)'
        ]
      },
      {
        id: 'gadfly',
        masque: true, // stagiaire : masqué (audit du 11 oct 2026), à remettre si besoin
        title: 'GADFLY',
        year: '2023',
        month: 'Novembre 2023',
        role: 'Stagiaire Électricien / Machino',
        realisateur: 'Taylor Knight',
        production: 'Pictor Prod × BAVARD',
        producteur: 'Adrien Bretet',
        dirProd: 'Baptiste Charpentier',
        premierAssReal: 'Coline Maylin',
        secondAssReal: 'Sandro Franco',
        scripte: 'Maxine Vagne',
        regisseurGeneral: 'Arthur Philippe',
        chefOp: 'Micaela Albanese',
        assistantCam: 'Camille Pascaud',
        secondAssistantCam: 'Vanille Davy',
        steadicam: 'Katia Hamnane',
        chefElectro: 'Jérémie Dignac',
        electros: 'Jeffrey Ramananjaona',
        stagiaires: 'Théo Sury',
        son: 'Guillaume Farkas',
        chefHMC: 'Celia Burtin',
        cheffeDecoratrice: 'Audrey Felix',
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
        description: 'Une nuit, dans un diner faiblement éclairé, une simple erreur de commande plonge Joe dans un voyage surréaliste et troublant. Le temps se distord, la réalité bascule, et les visages familiers adoptent des rôles énigmatiques alors qu\'il cherche quelque chose qui n\'a peut-être jamais existé.',
        synopsis: 'Mêlant tension psychologique et absurdité onirique, Gadfly explore la frontière fragile entre le réel et l\'imaginaire, entraînant son protagoniste (et le spectateur) dans un monde où rien n\'est vraiment ce qu\'il semble être.',
        specs: {
          format: 'Court-métrage',
          duree: '11min06',
          jours: '2 nuits',
          tournage: 'Novembre 2023',
          lieu: 'Paris 20e',
        },
        cast: [
          'Eden Mele',
          'Francois Berthier',
          'Mattew Dussier',
          'Maxime Alvarez',
          'Sophie Richelieu',
          'Moulay Maslouhi'
        ]
      },
      {
        id: 'revolte',
        boucles: [1, 2, 4].map((n) => `/videos/boucles/revolte-${n}`),
        boucleRatio: '1200 / 598', // format des extraits (bandes noires retirées)
        title: 'Le Révolté',
        year: '2023',
        month: 'Mai 2023',
        role: 'Chef électro',
        realisateur: 'Nicolas Baste',
        scenariste: 'Nicolas Baste',
        production: 'ESEC',
        premierAssReal: 'Victoria Vals',
        scripte: 'Mathilde Chaperon',
        cheffeOp: 'Louise Stein',
        assistantCam: 'Guilhem Leroux',
        chefElectro: 'Théo Sury',
        son: 'Axel Ducrocq',
        perchman: 'Jonathan Bartholome',
        regisseurs: 'Victoria Vals, Léo Aguiton & Jonathan Bartholme',
        thumbnail: '/images/revolte-thumb.jpg',
        images: [],
        youtubeId: 'PPvxZQ_3x3c',
        description: 'Louis, un fils d\'immigrés chinois manifestant en France contre la politique du gouvernement, entre en conflit avec son père quand il apprend que celui-ci désapprouve sa révolte dans ce qui est pour lui une terre d\'accueil. Film de fin de cycle 1.',
        specs: {
          duree: '10min22',
          format: 'Court-métrage fiction',
          annee: '2023',
          camera: 'Sony FS7',
          objectifs: 'Sony G Master Zoom'
        },
        cast: [
          'Andrea Zamparo',
          'Longmon Wang',
          'Rong-Ying Yang'
        ]
      },
      {
        id: 'une-couronne',
        photo: 'Vincent Milleville',
        boucles: [1, 2, 3].map((n) => `/videos/boucles/une-couronne-${n}`), // extraits muets (aperçu au survol dans la liste)
        boucleRatio: '1200 / 600',
        boucles: [1, 2, 3, 4, 5].map((n) => `/videos/boucles/une-couronne-${n}`), // extraits muets (YouTube)
        boucleRatio: '1200 / 600',
        masque: true, // auxiliaire de régie : masqué (audit du 11 oct 2026), à remettre si besoin
        title: 'Une Couronne',
        year: '2022',
        month: 'Avril 2022',
        role: 'Auxiliaire de régie',
        realisateurs: 'Salma Taibi & Bruno Ribuot-Hirsch',
        scenariste: 'Lisa Carette',
        production: 'ESEC',
        producteur: 'Lee Lou Veylon',
        premierAssReal: 'Gaël Frelau',
        scripte: 'Constance Laval',
        chefOp: 'Syvian Qi',
        cadreuse: 'Maria Mashtakova',
        assistantCam: 'Nina Crimet',
        chefElectro: 'Elio Jordan',
        chefMachino: 'David Da Silva',
        son: 'Robin Baco',
        perchman: 'Lichun Li',
        directionArtistique: 'Manon Gentilhomme',
        regisseurGeneral: 'Manon Tellier',
        regisseurs: 'Alex Barreault, Louise Uhmann, Théo Sury, Valentin Mottet, Julie Lacor & Sacha Van Den Berch Van Heemstede',
        monteur: 'Vincent Milleville',
        mixage: 'Claire Feliz',
        etalonneur: 'Adam Charpentier',
        thumbnail: '/images/une-couronne-thumb.jpg',
        images: [],
        youtubeId: 'c9wZt6gs-ZU',
        description: 'Sybille est la comédienne la plus populaire de son époque. Mère dirigiste et autoritaire, elle pousse sa fille Flora à rentrer dans le milieu. Mais la jeunesse de Flora effacera le succès de sa mère qui semblait être éternel… Film de fin d\'études ESEC.',
        specs: {
          format: 'Court-métrage fiction',
          duree: '10min48',
          tournage: 'Avril 2022',
          annee: '2022',
          camera: 'Arri ALEXA Classic (SXT Plus)',
          objectifs: 'Cooke S4/i',
        },
        cast: [
          'Maëlle Genet',
          'Olivia Jubin',
          'François Ayrault',
          'Valentin Riedinger',
          'Kevin David-Girard',
          'Caroline Dubreuil',
          'Magalie Botella Martinez',
          'Gabriel Tiphine'
        ]
      },
    ];

    // Écarter les films marqués « masque: true », puis appliquer l'ordre
    return appliquerOrdre(allFilms.filter((film) => !film.masque));
  },

  // ========== AUTRES EXPÉRIENCES ==========
  autres: [
    {
      id: 'veronne-production',
      title: 'Verone Productions',
      year: '2026',
      role: 'Road',
      duree: 'Depuis juin 2026',
      description: 'Montage, exploitation et démontage sur des concerts et des festivals.',
      couverture: 2,
      photos: Array.from({ length: 6 }, (_, i) => `/images/experiences/veronne-production/${i + 1}`)
    },
    {
      id: 'panavision',
      logo: '/images/logos/panavision.svg',
      title: 'Panavision ALGA',
      year: '2024',
      role: 'Stagiaire caméra',
      production: 'Panavision ALGA',
      duree: '3 mois',
      description: 'Stage au magasin et au service filtres : préparation, maintenance et configuration caméra.',
      couverture: 1,
      photos: Array.from({ length: 5 }, (_, i) => `/images/experiences/panavision/${i + 1}`)
    },
    {
      id: 'dixit-afdas',
      title: 'DIXIT',
      year: '2025',
      role: 'Assistant technique (cadre, lumière, régie)',
      production: 'AFDAS',
      duree: 'Janvier & juin 2025',
      description: 'Captation de sessions de formation à la direction d\'acteur.',
      couverture: 1,
      photos: Array.from({ length: 4 }, (_, i) => `/images/experiences/dixit-afdas/${i + 1}`)
    },
    {
      id: 'dna',
      logo: '/images/logos/tf1.svg',
      title: 'Demain Nous Appartient (DNA)',
      year: '2024',
      role: '3e assistant caméra',
      realisateurs: 'Alexis Charrier & Thomas Lipmann',
      directeursPhoto: 'William Hulin & Hervé Lodé',
      production: 'TELSETE pour TF1',
      duree: '1 mois, 2 sessions',
      description: 'Assistanat caméra sur la série quotidienne de TF1.',
      couverture: 3,
      photos: Array.from({ length: 4 }, (_, i) => `/images/experiences/dna/${i + 1}`)
    },
    {
      id: 'darwin-experience',
      title: 'Darwin Experience',
      year: '2025',
      role: 'Photographe & making-of',
      production: 'PRISM, avec le soutien du CNC',
      duree: 'Janvier 2025, 3 jours au Havre',
      description: 'Making-of du tournage des quatre clips de l\'EP « Home ».',
      realisateurs: 'Martin Schrepel',
      directeursPhoto: 'Grégoire Léon-Dufour',
      // Mes making-of (format vertical) ; les clips eux-mêmes en lien, au clic
      makingOf: [
        { boucle: '/videos/darwin-boucle-automatic-doors', file: '/videos/darwin-making-automatic-doors.mp4', title: 'Automatic Doors', clip: '89fB1I9N_1o' },
        { boucle: '/videos/darwin-boucle-home', file: '/videos/darwin-making-home.mp4', title: 'Home', clip: 'aKJyRwJYJXI' },
        { boucle: '/videos/darwin-boucle-i-killed-you', file: '/videos/darwin-making-i-killed-you.mp4', title: 'I Killed You', clip: 'SQz6HeVUkfA' },
        { boucle: '/videos/darwin-boucle-just-want-to-dance', file: '/videos/darwin-making-just-want-to-dance.mp4', title: 'Just Want To Dance', clip: 'U5DOOxT_HKU' },
      ],
    },
    {
      id: 'noctem',
      title: 'Noctem Events',
      year: '2023-2024',
      role: 'Photographe',
      production: 'Noctem Events',
      duree: '2 événements',
      description: 'Photographie de soirées, en conditions de très faible lumière.',
      couverture: 1,
      // Flash direct en alternance avec les photos où la lumière de scène se voit
      // (13 à 17 : dérivés Photos à 1086 px, à remplacer par les originaux)
      photos: [14, 3, 15, 4, 13, 6, 16, 5, 17, 1].map((n) => `/images/noctem/noctem-${n}`)
    }
  ]
};

// ========== DONNÉES "À PROPOS" ==========
export const aboutData = {
  title: 'Théo Sury',
  subtitle: 'Chef-opérateur & Électricien',
  specialization: 'Fiction, clips, publicité & concerts',
  location: 'Lille / Paris',

  bio: `Basé à Lille, je travaille beaucoup à Paris, en fiction, en publicité, en clip et en captation. Ce qui m'anime avant tout, c'est la lumière.

Aujourd'hui électricien et chef-opérateur, je connais le plateau de l'intérieur : j'ai été régisseur, puis troisième assistant caméra sur une série quotidienne, et je sais la place de chacun dans une équipe. J'interviens aussi sur des concerts et des festivals.

Disponible en tant qu'électricien ou chef électricien, et à l'écoute de tout projet en tant que chef-opérateur.`,

  skills: [
    'Direction de la photographie',
    'Électricité plateau & chef électro',
    'Assistanat caméra',
    'Road : montage, exploitation, démontage',
    'Étalonnage',
    'Photographie'
  ],

  // Infos utiles à un employeur qui cherche un renfort
  pratique: [
    'Basé à Lille, mobile sur Paris et les Hauts-de-France',
    'Permis B, véhiculé'
  ],

  contact: {
    email: 'theosury@gmail.com',
    phone: '07 50 84 62 01',
    instagram: '@theosury',
    vimeo: '',
    linkedin: '@theosury'
  }
};