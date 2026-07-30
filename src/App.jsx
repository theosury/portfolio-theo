import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import PageTransition from './components/PageTransition/PageTransition';
import './styles/global.css';

const Home = lazy(() => import('./pages/Home'));
const Films = lazy(() => import('./pages/Films'));
const FilmDetail = lazy(() => import('./pages/FilmDetail'));
const PhotosPage = lazy(() => import('./pages/PhotosPage'));
const Experiences = lazy(() => import('./pages/Experiences'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

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
                <Route path="/films" element={<Films />} />
                <Route path="/films/:slug" element={<FilmDetail />} />
                <Route path="/photos" element={<PhotosPage />} />
                <Route path="/experiences" element={<Experiences />} />
                <Route path="/contact" element={<ContactPage />} />
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
