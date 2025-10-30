import React from 'react';
import Hero from '../components/Hero/Hero';
import HeroProjects from '../components/HeroProjects/HeroProjects';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <HeroProjects />
    </div>
  );
};

export default Home;