import React from 'react';
import { aboutData } from '../../data/projectsData';
import './Contact.css';

const Contact = () => {
  return (
    <section className="contact section" id="contact">
      <div className="container">
        <div className="contact__content">
          <h2 className="contact__title">Me contacter</h2>
          <p className="contact__subtitle">
            Intéressé par une collaboration ? N'hésitez pas à me contacter.
          </p>

          <div className="contact__methods">
            {aboutData.contact.email && (
              <a 
                href={`mailto:${aboutData.contact.email}`}
                className="contact__method"
              >
                <span className="contact__method-label">Email</span>
                <span className="contact__method-value">{aboutData.contact.email}</span>
              </a>
            )}

            {aboutData.contact.phone && (
              <a 
                href={`tel:${aboutData.contact.phone}`}
                className="contact__method"
              >
                <span className="contact__method-label">Téléphone</span>
                <span className="contact__method-value">{aboutData.contact.phone}</span>
              </a>
            )}

            {aboutData.contact.instagram && (
              <a 
                href={`https://instagram.com/${aboutData.contact.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__method"
              >
                <span className="contact__method-label">Instagram</span>
                <span className="contact__method-value">{aboutData.contact.instagram}</span>
              </a>
            )}

            {aboutData.contact.vimeo && (
              <a 
                href={`https://vimeo.com/${aboutData.contact.vimeo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__method"
              >
                <span className="contact__method-label">Vimeo</span>
                <span className="contact__method-value">{aboutData.contact.vimeo}</span>
              </a>
            )}

            {aboutData.contact.linkedin && (
              <a 
                href={`https://linkedin.com/in/${aboutData.contact.linkedin.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__method"
              >
                <span className="contact__method-label">Linkedin</span>
                <span className="contact__method-value">{aboutData.contact.linkedin}</span>
              </a>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
