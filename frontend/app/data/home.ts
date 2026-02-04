export const siteData = {
  brand: {
    name: "SportsComp",
    tagline:
      "Plateforme sportive premium pour organiser, performer et monetiser vos evenements.",
    metaTitle: "SportsComp | Plateforme sportive premium",
    metaDescription:
      "Organisez, publiez et remplissez vos evenements sportifs avec une experience fluide pour joueurs et organisateurs.",
  },
  nav: {
    links: [
      { label: "Accueil", href: "/" },
      { label: "Tournois", href: "/tournois" },
      { label: "A propos", href: "/a-propos" },
      { label: "Contact", href: "/contact" },
    ],
    auth: {
      login: "Connexion",
      signup: "Voir details",
      logout: "Logout",
    },
  },
  header: {
    defaultName: "Utilisateur",
    roleLabels: {
      athlete: "Athlete",
      organizer: "Organisateur",
    },
    menu: {
      athlete: [
        { label: "Profil", href: "/profil" },
        { label: "Favoris", href: "/favoris" },
        { label: "Mes evenements", href: "/mes-evenements" },
      ],
      organizer: [
        { label: "Profil", href: "/profil" },
        { label: "Tableau de bord", href: "/dashboard" },
        { label: "Gestion des evenements", href: "/organisateur/evenements" },
        { label: "Participants", href: "/organisateur/participants" },
        { label: "Finances", href: "/organisateur/finances" },
      ],
      menuFooter: "Confidentialite | Conditions | Cookies",
    },
  },
  home: {
    ticker: [
      "En direct: Finale Nationale | Club Atlas vs Lions (1-1)",
      "A venir: Semi-marathon de Tunis | depart dans 40m",
      "En direct: Open Tennis | Terrain central (2-1)",
      "Termine: Coupe Basket | Eagles 78-70 Raptors",
    ],
    hero: {
      badge: "Saison 2026 en action",
      title: "Defiez vos limites.",
      highlight: "Passez au niveau pro.",
      description:
        "La plateforme sportive moderne pour tournois et competitions locales. Lancez vos evenements, gerez les inscriptions et offrez une experience fluide aux joueurs.",
      highlights: [
        "Inscriptions en 2 minutes",
        "Billets QR & check-in rapide",
        "Paiements securises",
      ],
      ctas: [
        { label: "Participer a un tournoi", href: "/signup", variant: "primary" as const },
        { label: "Organiser un evenement", href: "/signup", variant: "secondary" as const },
      ],
      socialProof: {
        text: "18 000 sportifs, 480 organisateurs actifs",
        avatars: ["AL", "MR", "SD"],
      },
      stats: [
        { label: "Evenements ouverts", value: "320+" },
        { label: "Organisateurs verifies", value: "240+" },
        { label: "Satisfaction joueurs", value: "4.9/5" },
      ],
      media: {
        kicker: "Finale en direct",
        leftTeam: "Club Atlas",
        rightTeam: "Lions",
        score: "2 - 1",
        summary: "Club Atlas vs Lions",
        status: "Live",
      },
      image: {
        src: "/images/hero-athlete.jpg",
        alt: "Athlete en action",
      },
    },
    logos: ["Nike", "Adidas", "Decathlon", "Red Bull", "Riot"],
    features: {
      eyebrow: "Sport & performance",
      title: "Tout ce qu'il faut pour performer.",
      description:
        "Du check-in QR aux statistiques live, pilotez chaque evenement avec precision.",
      tabs: ["Joueurs", "Organisateurs"],
      cards: [
        {
          title: "Stats en temps reel",
          copy:
            "Suivez les performances, la progression et les records en direct.",
          icon: "S",
        },
        {
          title: "Classements verifies",
          copy:
            "Validez vos performances et grimpez les classements officiels.",
          icon: "C",
        },
        {
          title: "Gestion d'equipe",
          copy:
            "Composez vos equipes, planifiez les matchs et coordonnez les entrainements.",
          icon: "G",
        },
      ],
    },
    tournaments: {
      eyebrow: "Tournois premium",
      title: "Les prochains rendez-vous sportifs.",
      action: { label: "Voir le calendrier", href: "/tournois" },
      ctaLabel: "Voir details",
      ctaHref: "/signup",
      items: [
        {
          name: "Tournoi Foot 5v5 - La Marsa",
          date: "Debut 02 Nov",
          teams: "32 equipes",
          prize: "Prix 3 000 TND",
          tag: "Football",
          image: { src: "/images/tournament-fps.svg", alt: "Tournoi Football" },
        },
        {
          name: "Open Basket 3x3 - Lac",
          date: "Debut 09 Nov",
          teams: "24 equipes",
          prize: "Prix 2 000 TND",
          tag: "Basket",
          image: { src: "/images/tournament-moba.svg", alt: "Tournoi Basket" },
        },
        {
          name: "Run City Challenge",
          date: "Debut 23 Nov",
          teams: "600 coureurs",
          prize: "Inscriptions 25 TND",
          tag: "Running",
          image: { src: "/images/tournament-race.svg", alt: "Tournoi Running" },
        },
        {
          name: "Fight Night Arena",
          date: "Debut 23 Nov",
          teams: "18 combats",
          prize: "Prix 4 000 TND",
          tag: "Combat",
          image: { src: "/images/tournament-combat.svg", alt: "Tournoi Combat" },
        },
      ],
    },
    leaderboard: {
      eyebrow: "Classements",
      title: "Top joueurs de la semaine",
      table: { headers: ["Rang", "Joueur", "Points", "Victoires"] },
      players: [
        { name: "Youssef B.", team: "Club Africain", points: "2,840", win: "+12.5%" },
        { name: "Rania M.", team: "ES Tunis", points: "2,620", win: "+10.2%" },
        { name: "Hatem N.", team: "Stade Sousse", points: "2,580", win: "+9.8%" },
      ],
      live: {
        title: "En direct",
        cta: "Voir le stream",
        items: [
          {
            title: "Finale regionale : Esperance vs CA",
            meta: "Stade Olympique, 19h30",
            status: "En direct",
          },
          {
            title: "Tournoi d'ete : Quart de finale",
            meta: "Arrivee des equipes dans 15m",
            status: "Commence dans 15m",
          },
          {
            title: "Ligue Pro : Demi-finales",
            meta: "Terrain central, 20h",
            status: "Ce soir a 20h",
          },
        ],
      },
    },
    insights: {
      eyebrow: "Ressources pro",
      title: "Le guide des organisateurs ambitieux.",
      description:
        "Prenez une longueur d'avance avec des tactiques de remplissage, pricing et engagement communautaire.",
      ctaLabel: "Lire l'article",
      posts: [
        {
          title: "Transformer un tournoi local en experience premium",
          excerpt:
            "Structurer votre tournoi, definir les regles et automatiser les inscriptions en 3 etapes.",
          date: "12 Oct 2025",
          tag: "Organisation",
          href: "/tournois",
          image: { src: "/images/insight-1.svg", alt: "Apercu organisation" },
        },
        {
          title: "Optimiser vos evenements sans perdre la communaute",
          excerpt:
            "Tarification progressive, billets early bird et gestion transparente des commissions.",
          date: "02 Nov 2025",
          tag: "Business",
          href: "/tournois",
          image: { src: "/images/insight-2.svg", alt: "Apercu business" },
        },
        {
          title: "Donner du rythme a vos saisons sportives",
          excerpt:
            "Calendriers intelligents, notifications ciblees et outils de suivi en temps reel.",
          date: "18 Nov 2025",
          tag: "Experience",
          href: "/tournois",
          image: { src: "/images/insight-3.svg", alt: "Apercu experience" },
        },
      ],
    },
    cta: {
      title: "Pret a passer au niveau pro ?",
      description:
        "Rejoignez une communaute ambitieuse. Jouez, organisez et pilotez vos competitions en toute confiance.",
      actions: [
        { label: "Creer un compte gratuit", href: "/signup", variant: "primary" as const },
        { label: "Parcourir les tournois", href: "/tournois", variant: "secondary" as const },
      ],
    },
  },
  tournois: {
    hero: {
      eyebrow: "Tournois",
      title: "Tournois qui font grandir votre ligue",
      description:
        "Explorez des competitions verifiees, des brackets fiables et une experience fluide pour chaque participant.",
      actions: [
        { label: "Creer un evenement", href: "/organisateur/evenements", variant: "primary" as const },
        { label: "Parcourir les formats", href: "/contact", variant: "secondary" as const },
      ],
      stats: [
        { label: "Tournois ouverts", value: "128" },
        { label: "Participants inscrits", value: "18 400" },
        { label: "Taux de remplissage", value: "86%" },
      ],
      image: { src: "/images/tournoi-hero.svg", alt: "Joueurs en action" },
    },
    filters: ["Tous", "Esport", "Running", "Combat", "Collectif", "Solo"],
    upcoming: {
      title: "A venir",
      description: "Selectionnez un format et rejoignez la prochaine vague d'evenements.",
      ctaLabel: "Voir details",
      ctaHref: "/contact",
      items: [
        {
          name: "Open Speed Arena",
          date: "20 Oct 2025",
          location: "Tunis",
          level: "Tous niveaux",
          price: "25 TND",
          capacity: "64 places",
          tag: "Esport",
          image: { src: "/images/tournament-fps.svg", alt: "Open Speed Arena" },
        },
        {
          name: "City Marathon Sprint",
          date: "02 Nov 2025",
          location: "Sousse",
          level: "Intermediaire",
          price: "15 TND",
          capacity: "120 places",
          tag: "Running",
          image: { src: "/images/tournament-race.svg", alt: "City Marathon Sprint" },
        },
        {
          name: "Combat League Series",
          date: "10 Nov 2025",
          location: "Ariana",
          level: "Avance",
          price: "40 TND",
          capacity: "82% places",
          tag: "Combat",
          image: { src: "/images/tournament-combat.svg", alt: "Combat League Series" },
        },
      ],
    },
    spotlight: {
      tag: "Focus organisateur",
      title: "Coupe Nationale SportsComp 2025",
      description:
        "Un format hybride qui combine phase de groupes, playoffs et live analytics pour maximiser l'engagement.",
      bullets: [
        "Diffusion multi-plateformes",
        "Tickets digitaux et QR",
        "Reporting participants en temps reel",
      ],
      image: { src: "/images/tournoi-spotlight.svg", alt: "Coupe nationale" },
      action: { label: "Demander une demo", href: "/contact" },
    },
    cta: {
      title: "Votre prochain tournoi commence ici",
      description:
        "Lancez un evenement en quelques minutes et centralisez les inscriptions, paiements et communications.",
      action: { label: "Parler a un conseiller", href: "/contact" },
    },
  },
  about: {
    hero: {
      tag: "Notre ADN competitif",
      title: "Alimenter l'esprit de competition",
      highlight: "avec une plateforme moderne.",
      description:
        "Nous donnons aux athletes, organisateurs et fans les moyens d'agir avec une technologie transparente, concue pour les ligues modernes.",
      actions: [
        { label: "Rejoindre l'equipe", href: "/contact", variant: "primary" as const },
        { label: "En savoir plus", href: "/tournois", variant: "secondary" as const },
      ],
      image: { src: "/images/about-hero.svg", alt: "Equipe en preparation" },
    },
    stats: [
      { label: "Joueurs inscrits", value: "50k+" },
      { label: "Ligues organisees", value: "500+" },
      { label: "Pays actifs", value: "30+" },
      { label: "Tournois qualifies", value: "120+" },
    ],
    philosophy: {
      tag: "Notre philosophie",
      title: "Dedies a l'esprit de competition.",
      description:
        "Chez SportsComp, chaque athlete merite une organisation fiable, transparente et axee sur la performance.",
      principles: [
        {
          title: "Notre mission",
          copy: "Rendre la competition plus juste et plus accessible.",
        },
        {
          title: "Notre vision",
          copy: "Un monde ou chaque ligue fonctionne comme une pro scene.",
        },
      ],
      values: [
        {
          title: "Confiance & securite",
          copy:
            "Des processus transparents pour proteger chaque equipe et chaque tournoi.",
        },
        {
          title: "Vitesse & precision",
          copy: "Matchmaking, inscriptions et resultats traites en temps reel.",
        },
        {
          title: "Impact durable",
          copy:
            "Nous aidons les organisateurs a construire des communautes engagees.",
        },
      ],
      images: [
        { src: "/images/about-grid-1.svg", alt: "Organisateur" },
        { src: "/images/about-grid-2.svg", alt: "Equipe" },
      ],
    },
    journey: {
      tag: "Histoire",
      title: "Notre parcours",
      lead: "Un progres constant, soutenu par les ligues du monde entier.",
      timeline: [
        {
          year: "2018",
          title: "Debuts dans un garage",
          copy: "Prototype developpe avec un seul tableau de bord.",
        },
        {
          year: "2019",
          title: "Premier tournoi majeur",
          copy: "Coupe universitaire regionale avec 80 equipes.",
        },
        {
          year: "2021",
          title: "Expansion globale",
          copy: "Support multilingue et entree sur le marche europeen.",
        },
        {
          year: "2023",
          title: "Plateforme 2.0",
          copy: "Analytics temps reel et outils B2B integres.",
        },
      ],
    },
    team: {
      tag: "Rencontrez l'equipe",
      title: "Les talents qui construisent SportsComp",
      trustLabel: "Approuve par des ligues du monde entier",
      action: { label: "Voir tous les membres", href: "/contact" },
      members: [
        {
          name: "Alex Morgan",
          role: "Product Lead",
          bio: "Ancien arbitre esport devenu architecte produit.",
          image: { src: "/images/team-1.svg", alt: "Alex Morgan" },
        },
        {
          name: "Sarah Chen",
          role: "Operations",
          bio: "Experte en logistique de ligues et evenements.",
          image: { src: "/images/team-2.svg", alt: "Sarah Chen" },
        },
        {
          name: "Michael Ross",
          role: "Engineering",
          bio: "Construit des systemes scalables pour les brackets.",
          image: { src: "/images/team-3.svg", alt: "Michael Ross" },
        },
        {
          name: "Jessica Lee",
          role: "Community",
          bio: "Anime les equipes et accompagne les organisateurs.",
          image: { src: "/images/team-4.svg", alt: "Jessica Lee" },
        },
      ],
      logos: ["Unity", "Corsair", "Twitch", "Intel", "Riot"],
      cta: {
        title: "Pret a elever votre niveau de jeu ?",
        description:
          "Rejoignez des milliers d'organisateurs et d'athletes qui font confiance a SportsComp.",
        actions: [
          { label: "Commencer gratuitement", href: "/signup", variant: "primary" as const },
          { label: "Contacter les ventes", href: "/contact", variant: "secondary" as const },
        ],
      },
    },
  },
  contact: {
    hero: {
      title: "Contactez-nous",
      description:
        "Nous sommes la pour vous accompagner. Que vous soyez un athlete en quete d'une equipe, un organisateur d'evenements ou un partenaire potentiel, entrons en contact.",
    },
    leftTitle: "Coordonnees",
    leftDescription: "Trouvez le bon service pour votre demande ci-dessous.",
    channels: [
      { title: "Support Joueurs", detail: "support@platform.com" },
      { title: "Demandes Organisateurs", detail: "events@platform.com" },
      { title: "Partenariats", detail: "partners@platform.com" },
    ],
    map: {
      label: "Bureau central",
      location: "San Francisco, CA",
      note: "Ouvert du lundi au vendredi",
      image: { src: "/images/contact-map.svg", alt: "Carte du bureau" },
    },
    social: {
      label: "Suivez-nous",
      items: ["LinkedIn", "Instagram", "YouTube"],
    },
    form: {
      title: "Envoyez-nous un message",
      fields: {
        name: {
          label: "Nom complet",
          placeholder: "Jean Dupont",
        },
        email: {
          label: "Adresse e-mail",
          placeholder: "jean@exemple.com",
        },
        role: {
          label: "Je suis...",
          options: [
            { value: "athlete", label: "Athlete / Participant" },
            { value: "organizer", label: "Organisateur" },
            { value: "partner", label: "Partenaire" },
            { value: "other", label: "Autre" },
          ],
        },
        message: {
          label: "Message",
          placeholder: "Comment pouvons-nous vous aider ?",
        },
      },
      submitLabel: "Envoyer le message",
      loadingLabel: "Envoi en cours...",
      successMessage: "Message envoye. Nous repondons rapidement.",
      errorMessage: "Message non envoye. Reessayez.",
      hint: {
        text: "Vous avez une simple question ? Consultez notre",
        linkLabel: "Centre d'aide",
        linkHref: "/contact",
        tail: "pour des reponses immediates.",
      },
    },
  },
  footer: {
    summary:
      "Plateforme tout-en-un pour gerer les tournois et suivre les carrieres esportives.",
    columns: [
      {
        title: "Plateforme",
        links: [
          { label: "Tournois", href: "/tournois" },
          { label: "Classements", href: "/tournois" },
          { label: "Equipes", href: "/a-propos" },
          { label: "Premium", href: "/contact" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Centre d'aide", href: "/contact" },
          { label: "Nous contacter", href: "/contact" },
          { label: "Regles", href: "/a-propos" },
          { label: "Confidentialite", href: "/a-propos" },
        ],
      },
      {
        title: "Organisateurs",
        links: [
          { label: "Creer un evenement", href: "/organisateur/evenements" },
          { label: "Outils de gestion", href: "/organisateur/evenements" },
          { label: "Acces API", href: "/contact" },
          { label: "Programme partenaire", href: "/contact" },
        ],
      },
    ],
    bottom: {
      note: "Copyright 2026 SportsComp. Tous droits reserves.",
      links: [
        { label: "Conditions", href: "/a-propos" },
        { label: "Confidentialite", href: "/a-propos" },
        { label: "Cookies", href: "/a-propos" },
      ],
    },
  },
};


