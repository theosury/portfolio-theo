import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#fff' }}>
          <h2>Une erreur est survenue.</h2>
          <p style={{ marginTop: '1rem', opacity: 0.7 }}>
            Essayez de{' '}
            <a href="/" style={{ color: '#ff3b3b', textDecoration: 'underline' }}>
              revenir à l'accueil
            </a>.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
