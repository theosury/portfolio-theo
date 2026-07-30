import React, { useEffect } from 'react';
import Contact from '../components/Contact/Contact';
import './ContactPage.css';

const ContactPage = () => {
  useEffect(() => {
    document.title = 'Contact | Théo Sury';
  }, []);

  return (
    <div className="contact-page">
      <Contact />
    </div>
  );
};

export default ContactPage;
