import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAF9F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: '#C15F3C',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16 7 22 7 22 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#1F1E1D',
                letterSpacing: '-0.5px',
              }}
            >
              StockWise
            </span>
          </Link>
          <p style={{ marginTop: 8, color: '#6B6762', fontSize: 14, margin: '8px 0 0' }}>
            Smart stock portfolio management
          </p>
        </div>

        {/* Auth card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #E5E2DA',
            borderRadius: 16,
            padding: 36,
            boxShadow: '0 1px 3px rgba(31,30,29,0.06)',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
