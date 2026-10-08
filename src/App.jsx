import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import PageTransition from './components/PageTransition/PageTransition';
import './styles/global.css';

const Home = lazy(() => import('./pages/Home'));
const FilmDetail = lazy(() => import('./pages/FilmDetail'));

function AppContent() {
  const location = useLocation();

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
