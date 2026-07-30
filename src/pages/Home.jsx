import React, { useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import HeroProjects from '../components/HeroProjects/HeroProjects';
import './Home.css';

const Home = () => {
  useEffect(() => {
    document.title = 'Théo Sury | Chef-opérateur & Électricien (Lille/Paris)';
  }, []);

  return (
    <div className="home">
      <Hero />
      <HeroProjects />
    </div>
  );
};

export default Home;