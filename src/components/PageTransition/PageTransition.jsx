import React, { useState, useEffect } from 'react';
import './PageTransition.css';

const PageTransition = ({ children, location }) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fade-in');

  useEffect(() => {
    if (children !== displayChildren) {
      setTransitionStage('fade-out');
    }
  }, [children, displayChildren]);

  const handleTransitionEnd = () => {
    if (transitionStage === 'fade-out') {
      setDisplayChildren(children);
      setTransitionStage('fade-in');
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      className={`page-transition ${transitionStage}`}
      onAnimationEnd={handleTransitionEnd}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
