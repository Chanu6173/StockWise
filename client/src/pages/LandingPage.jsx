import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, BarChart2, ShieldCheck, Activity } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Real-time Quotes',
    description:
      'Live stock prices and historical charts powered by Finnhub market data.',
  },
  {
    icon: BarChart2,
    title: 'Portfolio Analytics',
    description:
      'Track allocation, growth trends, and profit/loss across all your holdings.',
  },
  {
    icon: ShieldCheck,
    title: 'Smart Watchlist',
    description:
      'Monitor stocks you are interested in and act quickly when the time is right.',
  },
  {
    icon: Activity,
    title: 'Transaction History',
    description:
      'A detailed ledger of every buy and sell with full filtering and export.',
  },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#FAF9F5', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Nav */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          height: 64,
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E2DA',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              background: '#C15F3C',
              borderRadius: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 7 22 7 22 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1F1E1D', letterSpacing: '-0.3px' }}>StockWise</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              style={{
                padding: '9px 20px',
                background: '#C15F3C',
                color: '#fff',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 14, fontWeight: 500, color: '#6B6762', textDecoration: 'none' }}>
                Sign in
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '9px 20px',
                  background: '#C15F3C',
                  color: '#fff',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 20px 80px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 99,
            background: 'rgba(193,95,60,0.08)',
            border: '1px solid rgba(193,95,60,0.20)',
            fontSize: 12,
            fontWeight: 600,
            color: '#C15F3C',
            marginBottom: 28,
          }}
        >
          <span>✦</span>
          Smart portfolio management
        </div>
        <h1
          style={{
            fontSize: 'clamp(36px, 7vw, 68px)',
            fontWeight: 800,
            color: '#1F1E1D',
            lineHeight: 1.1,
            letterSpacing: '-2px',
            margin: '0 auto 24px',
            maxWidth: 700,
          }}
        >
          Invest with{' '}
          <span style={{ color: '#C15F3C' }}>clarity</span>
        </h1>
        <p
          style={{
            fontSize: 18,
            color: '#6B6762',
            lineHeight: 1.7,
            maxWidth: 540,
            margin: '0 auto 44px',
          }}
        >
          StockWise gives you the tools to track your portfolio, analyze
          performance, and stay informed — all in one place.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/register"
            style={{
              padding: '14px 32px',
              background: '#C15F3C',
              color: '#ffffff',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: 16,
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(193,95,60,0.25)',
            }}
          >
            Start tracking for free
          </Link>
          <Link
            to="/login"
            style={{
              padding: '14px 32px',
              background: '#F4F3EE',
              color: '#1F1E1D',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: 16,
              fontWeight: 500,
              border: '1px solid #E5E2DA',
            }}
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 40px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}
        >
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E2DA',
                borderRadius: 12,
                padding: '28px 24px',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(31,30,29,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 9,
                  background: 'rgba(193,95,60,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Icon size={20} style={{ color: '#C15F3C' }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F1E1D', margin: '0 0 8px' }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#6B6762', lineHeight: 1.6, margin: 0 }}>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #E5E2DA',
          padding: '28px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 13, color: '#B1ADA1' }}>
          &copy; {new Date().getFullYear()} StockWise. For educational use only.
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link to="/login" style={{ fontSize: 13, color: '#B1ADA1', textDecoration: 'none' }}>Sign in</Link>
          <Link to="/register" style={{ fontSize: 13, color: '#B1ADA1', textDecoration: 'none' }}>Register</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
