import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Essai « grand format » : ?bento l'active, ?bento=0 l'éteint ; gardé le temps
// de la visite pour suivre sur les fiches films. Styles sous .bento dans chaque CSS.
try {
  const p = new URLSearchParams(window.location.search).get('bento');
  if (p !== null) sessionStorage.setItem('bento', p === '0' ? '' : '1');
  if (sessionStorage.getItem('bento')) document.documentElement.classList.add('bento');
} catch { /* stockage indisponible */ }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
