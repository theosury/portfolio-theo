import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { aboutData } from '../data/projectsData';
import './PagesSimples.css';

// Titre de l'onglet le temps de la page, puis retour au titre du site
const useTitre = (titre) => {
  useEffect(() => {
    const avant = document.title;
    document.title = titre;
    return () => { document.title = avant; };
  }, [titre]);
};

// Une page que Google ne doit pas indexer (404) : balise robots le temps de la visite
const useNoIndex = () => {
  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    const avant = meta?.getAttribute('content');
    meta?.setAttribute('content', 'noindex');
    return () => { if (meta && avant) meta.setAttribute('content', avant); };
  }, []);
};

export const MentionsLegales = () => {
  useTitre('Mentions légales | Théo Sury');
  const email = aboutData.contact.email;

  return (
    <section className="page-simple">
      <div className="container page-simple__contenu">
        <h1 className="page-simple__titre">Mentions légales</h1>

        <h2>Éditeur</h2>
        <p>
          Ce site est le portfolio personnel de Théo Sury, chef-opérateur et électricien.
          <br />
          Contact : <a href={`mailto:${email}`}>{email}</a>
        </p>

        <h2>Hébergement</h2>
        <p>
          Netlify, Inc., 101 2nd Street, Suite 575, San Francisco, CA 94105, États-Unis.
          <br />
          <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">netlify.com</a>
        </p>

        <h2>Images et vidéos</h2>
        <p>
          Les extraits, photogrammes et affiches appartiennent à leurs productions et à leurs
          auteurs respectifs. Ils sont montrés ici pour présenter mon travail sur ces films.
          Les photos de plateau restent la propriété de leurs photographes.
          Pour toute demande de retrait ou de crédit, écrivez-moi.
        </p>

        <h2>Données personnelles</h2>
        <p>
          Le site ne dépose aucun cookie et ne demande aucune donnée.
          La fréquentation est mesurée avec GoatCounter, un outil sans cookie qui ne suit pas
          les visiteurs d'un site à l'autre et ne garde pas d'adresse IP.
          Si vous m'écrivez, votre message sert uniquement à vous répondre.
        </p>

        <Link to="/" className="page-simple__retour">Retour à l'accueil</Link>
      </div>
    </section>
  );
};

export const Introuvable = () => {
  useTitre('Page introuvable | Théo Sury');
  useNoIndex();

  return (
    <section className="page-simple page-simple--introuvable">
      <div className="container page-simple__contenu">
        <h1 className="page-simple__titre">Page introuvable</h1>
        <p>Cette adresse ne mène nulle part. Le film que vous cherchez a peut-être changé de nom.</p>
        <Link to="/" state={{ section: 'films' }} className="page-simple__retour">Voir les films</Link>
      </div>
    </section>
  );
};
