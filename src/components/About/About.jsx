import React from 'react';
import { aboutData } from '../../data/projectsData';
import './About.css';

const About = () => {
  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="about__content">
          <div className="about__text">
            <h2 className="about__title">{aboutData.title}</h2>
            <p className="about__subtitle">{aboutData.subtitle}</p>
            {aboutData.specialization && (
              <p className="about__specialization">{aboutData.specialization}</p>
            )}
            {aboutData.location && (
              <p className="about__location">{aboutData.location}</p>
            )}
            <div className="about__bio">
              {aboutData.bio.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="about__skills">
            <h3 className="about__skills-title">Compétences</h3>
            <ul className="about__skills-list">
              {aboutData.skills.map((skill, index) => (
                <li key={index} className="about__skill">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
