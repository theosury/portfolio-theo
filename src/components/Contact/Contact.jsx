import React from 'react';
import { aboutData } from '../../data/projectsData';
import { IconeInstagram, IconeLinkedin } from '../Icones';
import './Contact.css';

const Contact = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <header className="page-header-unified">
          <h1 className="page-title-unified">Contact</h1>
        </header>

        <div className="contact__content">
          <p className="contact__subtitle">
            Intéressé par une collaboration ? N'hésitez pas à me contacter.
          </p>

          {/* Le mail et le téléphone en grand, les réseaux en dessous */}
          <div className="contact__principal">
            {aboutData.contact.email && (
              <a href={`mailto:${aboutData.contact.email}`} className="contact__grand">
                {aboutData.contact.email}
              </a>
            )}
            {aboutData.contact.phone && (
              <a href={`tel:${aboutData.contact.phone.replace(/\s/g, '')}`} className="contact__grand contact__grand--tel">
                {aboutData.contact.phone}
              </a>
            )}
          </div>

          <div className="contact__reseaux">
            {aboutData.contact.instagram && (
              <a
                href={`https://instagram.com/${aboutData.contact.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__reseau"
              >
                <IconeInstagram taille={22} />
                <span>Instagram</span>
              </a>
            )}
            {aboutData.contact.vimeo && (
              <a href={`https://vimeo.com/${aboutData.contact.vimeo}`} target="_blank" rel="noopener noreferrer" className="lien-souligne">
                Vimeo
              </a>
            )}
            {aboutData.contact.linkedin && (
              <a
                href={`https://linkedin.com/in/${aboutData.contact.linkedin.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__reseau"
              >
                <IconeLinkedin taille={22} />
                <span>LinkedIn</span>
              </a>
            )}
          </div>

          <p className="contact__pratique">{aboutData.pratique.join(' · ')}</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
