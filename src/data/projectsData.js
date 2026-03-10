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
        'juillet': 7, 'aout': 8, 'septembre': 9, 'octobre': 10, 'novembre': 11, 'decembre': 12
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
  heroProjectIds: ['vedette', 'vagues', 'asterix', 'casse-cest-casse'],

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
          lieu: 'Studio',
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
        title: 'Ce que laissent les vagues',
        year: '2024',
        month: 'Mai 2024',
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
          lieu: 'Bretagne',
          camera: 'Arri ALEXA SXT Plus',
          objectifs: 'Cooke S4',
          cadrage: 'Easyrig'
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
        title: 'Cassé c\'est Cassé',
        year: '2026',
        month: 'Mars 2026',
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
        machino: 'Roman Popsing & Philippe de Vitry',
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
          lieu: 'Studio Kremlin, Ivry-sur-Seine',
          tournage: 'Mars 2026',
        },
      },
      {
        id: 'asterix',
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
          jours: '10 jours (2 semaines)',
          camera: 'Blackmagic 6K'
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
        images: [],
        specs: {
          format: 'Court-métrage',
          lieu: 'Plaine Image, Tourcoing',
          tournage: 'Septembre 2025',
          camera: 'Alexa 35 / Sony A7S IV',
          objectifs: 'Cooke Varotal / Cooke S8/i FF',
          particularite: 'Dolly, machine à fumée, green screen'
        }
      },

      /*
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
      */

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
        assistantCam: 'Eve Rameseyer',
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
        images: [],
        specs: {
          lieu: 'LCR Les Tailleurs, Villeneuve-d\'Ascq',
          tournage: 'Juillet 2025',
          camera: 'Alexa 35',
          objectifs: 'Panavision Primo'
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
        status: 'En post-production',
        images: [],
        specs: {
          format: 'Court-métrage médiéval',
          lieu: 'Château de la Lande, Montaigu-Vendée',
          tournage: 'Octobre 2025',
          camera: 'Alexa Mini LF',
          objectifs: 'Panavision Primo',
          particularite: 'Scènes de bataille, effets flèches 3D'
        }
      },
      {
        id: 'jugement-dernier',
        title: 'Jugement Dernier',
        year: '2025',
        month: 'Decembre 2025',
        role: 'Chef-opérateur',
        realisateurs: 'Matthis Geffroy & Luca Flodrops',
        artiste: 'Luca Flodrops',
        production: 'Make My Day',
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
        status: 'En post-production',
        images: [],
        specs: {
          format: 'Clip',
          lieu: 'Château du Bec, Saint-Martin-Du-Bec, Normandie',
          tournage: 'Decembre 2025',
          camera: 'RED Komodo X',
          objectifs: 'Atlas Mercury Anamorphiques',
          particularite: 'Scènes de torture, VFX'
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
        title: 'Armanaque',
        year: '2024',
        month: 'Juillet 2024',
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
        description: 'Moyen-métrage fiction (45min52) tourné en 2 semaines en banlieue parisienne. Film auto-produit avec matériel prêté par le Cours Florent et l\'ESEC.',
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
          lieu: 'Banlieue parisienne',
          camera: 'Sony FS7',
          objectifs: 'Sony G Master',
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
        title: 'Casse-Noisette',
        year: '2024',
        month: 'Juin 2024',
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
          format: 'Court-métrage studio',
          jours: '1 jour',
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
          lieu: 'Maisons-Laffitte',
          tournage: 'Avril 2024',
          camera: 'Arri ALEXA Classic (SXT Plus)',
          objectifs: 'Cooke S4/i'
        }
      },
      {
        id: 'loverdance',
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
        description: 'Lola rencontre Simon lors d\'un marathon de 24 heures de danse. Alors que la compétition bat son plein, ils développent une complicité qui la détourne de son objectif. Mais les éliminations se succèdent à un rythme effréné et, à bout de souffle, elle décide de s\'unir à lui pour une danse qui pourrait bien les mener à la victoire…',
        vimeoId: '1025523467?autoplay=1&loop=1&autopause=0&player_id=0&app_id=58479&background=1',
        specs: {
          format: 'Court-métrage fiction',
          coproduction: 'Filmakademie Baden-Württemberg, La Fémis, ARTE, SWR',
          pays: 'France / Allemagne',
          annee: '2024',
          camera: 'Alexa Mini LF',
          objectifs: 'Angénieux Style Optimo / ARRI Signature Zoom'
        },
        cast: [
          'Louise Luck (Lola)',
          'Frederico Semedo (Simon)',
          'Yannick Blivet (Animateur)'
        ]
      },
      {
        id: 'insipide',
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
        title: 'GADFLY',
        year: '2023',
        month: 'Octobre 2023',
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
          format: 'Court-métrage'
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
        title: 'Une Couronne',
        year: '2022',
        month: 'Juin 2022',
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
          annee: '2022',
          camera: 'Arri ALEXA Classic (SXT Plus)',
          objectifs: 'Cooke S4/i'
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