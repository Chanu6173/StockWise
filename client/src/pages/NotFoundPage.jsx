import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => (
  <div
    style={{
      minHeight: '100vh',
      background: '#FAF9F5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      flexDirection: 'column',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        fontSize: 80,
        fontWeight: 800,
        color: '#E5E2DA',
        lineHeight: 1,
        marginBottom: 16,
        letterSpacing: '-4px',
      }}
    >
      404
    </div>
    <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F1E1D', margin: '0 0 12px' }}>
      Page not found
    </h1>
    <p style={{ fontSize: 15, color: '#6B6762', margin: '0 0 36px', maxWidth: 360 }}>
      The page you are looking for does not exist or has been moved.
    </p>
    <Link
      to="/dashboard"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 24px',
        background: '#C15F3C',
        color: '#ffffff',
        borderRadius: 9,
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      <ArrowLeft size={16} />
      Back to Dashboard
    </Link>
  </div>
);

export default NotFoundPage;
