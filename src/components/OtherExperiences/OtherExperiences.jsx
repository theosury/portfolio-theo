import React from 'react';
import { projectsData } from '../../data/projectsData';
import ProjectCard from '../ProjectCard/ProjectCard';
import './OtherExperiences.css';

const OtherExperiences = () => {
  return (
    <section className="other-experiences section" id="other-experiences">
      <div className="container">
        <div className="other-experiences__header">
          <h2 className="other-experiences__title">Autres expériences</h2>
        </div>

        <div className="other-experiences__grid">
          {projectsData.autres.map((experience) => (
            <div key={experience.id} className="other-experience">
              <div className="other-experience__image-wrapper">
                <img 
                  src={experience.thumbnail} 
                  alt={experience.title}
                  className="other-experience__image"
                  loading="lazy"
                />
              </div>
              <div className="other-experience__content">
                <h3 className="other-experience__title">{experience.title}</h3>
                <div className="other-experience__meta">
                  <span className="other-experience__year">{experience.year}</span>
                  <span className="other-experience__separator">•</span>
                  <span className="other-experience__role">{experience.role}</span>
                </div>
                {experience.production && (
                  <p className="other-experience__production">{experience.production}</p>
                )}
                {experience.description && (
                  <p className="other-experience__description">{experience.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherExperiences;
