import React from 'react';
import Hero from '../components/Hero/Hero';
import HeroProjects from '../components/HeroProjects/HeroProjects';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <HeroProjects />
      
      {/* CTA pour voir tous les projets */}
      <section className="home-cta section">
        <div className="container">
          <Link to="/films" className="btn btn-primary">
            Voir tous les projets
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
