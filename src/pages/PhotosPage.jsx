import React, { useEffect } from 'react';
import Photos from '../components/Photos/Photos';
import './PhotosPage.css';

const PhotosPage = () => {
  useEffect(() => {
    document.title = 'Photos — Théo Sury';
  }, []);

  return (
    <div className="photos-page">
      <Photos />
    </div>
  );
};

export default PhotosPage;
