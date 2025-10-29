import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import HeroProjects from './components/HeroProjects/HeroProjects';
import Films from './components/Films/Films';
import ProjectsInProgress from './components/ProjectsInProgress/ProjectsInProgress';
import Photos from './components/Photos/Photos';
import About from './components/About/About';
import OtherExperiences from './components/OtherExperiences/OtherExperiences';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import './styles/global.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <HeroProjects />
        <Films />
        <ProjectsInProgress />
        <Photos />
        {/*<OtherExperiences />*/}
        {/*<About />*/}
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
