import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import PageTransition from './components/PageTransition/PageTransition';
import './styles/global.css';

const Home = lazy(() => import('./pages/Home'));
const FilmDetail = lazy(() => import('./pages/FilmDetail'));

// Compte une visite GoatCounter par page (le script peut finir de charger après le premier rendu)
function compterVisite(path) {
  if (window.goatcounter?.count) {
    window.goatcounter.count({ path });
    return;
  }
  const script = document.querySelector('script[data-goatcounter]');
  script?.addEventListener('load', () => window.goatcounter?.count?.({ path }), { once: true });
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    compterVisite(location.pathname);
  }, [location.pathname]);

  return (
    <div className="app">
      <Header />
      <main>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <PageTransition location={location}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/films/:slug" element={<FilmDetail />} />
                {/* Anciennes pages : tout est maintenant sur l'accueil */}
                {['films', 'experiences', 'photos', 'contact'].map((section) => (
                  <Route key={section} path={`/${section}`} element={<Navigate to="/" replace state={{ section }} />} />
                ))}
              </Routes>
            </PageTransition>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
