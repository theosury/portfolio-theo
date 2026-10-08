import React from 'react';
import { aboutData } from '../../data/projectsData';
import { IconeInstagram, IconeLinkedin } from '../Icones';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__socials">
            {aboutData.contact.instagram && (
              <a
                href={`https://instagram.com/${aboutData.contact.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Instagram"
              >
                <IconeInstagram />
              </a>
            )}
            {aboutData.contact.linkedin && (
              <a
                href={`https://linkedin.com/in/${aboutData.contact.linkedin.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="LinkedIn"
              >
                <IconeLinkedin />
              </a>
            )}
          </div>
          <p className="footer__text">
            © {currentYear} Théo Sury
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
