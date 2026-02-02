import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Films from './pages/Films';
import FilmDetail from './pages/FilmDetail';
import PhotosPage from './pages/PhotosPage';
import ContactPage from './pages/ContactPage';
import PageTransition from './components/PageTransition/PageTransition';
import './styles/global.css';

function AppContent() {
  const location = useLocation();

  return (
    <div className="app">
      <Header />
      <main>
        <PageTransition location={location}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/films" element={<Films />} />
            <Route path="/films/:slug" element={<FilmDetail />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </PageTransition>
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
