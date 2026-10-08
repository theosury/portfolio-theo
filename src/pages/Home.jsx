import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import Films from './Films';
import Experiences from './Experiences';
import Photos from '../components/Photos/Photos';
import Contact from '../components/Contact/Contact';
import { aboutData } from '../data/projectsData';
import './Home.css';

// Le site tient sur une seule page : présentation, films, expériences, photos, contact.
// Les anciennes adresses (/films, /photos…) arrivent ici avec la section à atteindre.
export const allerA = (section) => {
  const el = document.getElementById(section);
  if (!el) return;
  const haut = el.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({ top: haut, behavior: 'smooth' });
};

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = 'Théo Sury | Chef-opérateur & Électricien (Lille/Paris)';
  }, []);

  // Arrivée depuis une autre page ou une ancienne adresse : on descend à la section
  useEffect(() => {
    // Retour d'une fiche : on reprend exactement où l'on était, sans animation
    const retourY = location.state?.retourY;
    if (retourY != null) {
      const timers = [0, 120, 400].map((d) => setTimeout(() => window.scrollTo(0, retourY), d));
      return () => timers.forEach(clearTimeout);
    }
    const section = location.state?.section;
    if (!section) return;
    const timer = setTimeout(() => allerA(section), 450);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="home">
      <Hero />

      {/* Présentation : portrait de plateau, accroche, puis la bio */}
      <section className="home-intro" id="home-intro">
        <figure className="home-intro__portrait">
          <img src="/images/portrait-plateau.jpg" alt="Théo Sury au cadre sur le tournage de Super Vespapa" loading="lazy" />
          <figcaption>Sur le tournage de Super Vespapa · Photo : Arthur Cassot</figcaption>
        </figure>
        <div className="home-intro__texte">
          <p className="home-intro__accroche">Chef-opérateur & électricien, entre Lille et Paris.</p>
          {aboutData.bio.split('\n\n').map((paragraphe, i) => (
            <p key={i}>{paragraphe}</p>
          ))}
        </div>
      </section>

      <section id="films" className="home-section">
        <Films dansAccueil />
      </section>

      <section id="experiences" className="home-section">
        <Experiences dansAccueil />
      </section>

      <section id="photos" className="home-section">
        <Photos />
      </section>

      <section id="contact" className="home-section">
        <Contact />
      </section>
    </div>
  );
};

export default Home;
