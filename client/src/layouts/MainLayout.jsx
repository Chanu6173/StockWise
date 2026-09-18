import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/portfolio')) return 'Portfolio';
    if (path.startsWith('/watchlist')) return 'Watchlist';
    if (path.startsWith('/transactions')) return 'Transactions';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/profile')) return 'Profile';
    if (path.startsWith('/stock/')) return 'Stock Details';
    return 'StockWise';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF9F5', display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 0.2s',
        }}
        className="sw-main-content"
      >
        <Navbar toggleSidebar={toggleSidebar} title={getPageTitle()} />
        <main
          style={{
            flex: 1,
            padding: '28px 32px',
            maxWidth: 1400,
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
          className="sw-main-padding"
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 30,
            background: 'rgba(31, 30, 29, 0.35)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <style>{`
        @media (min-width: 768px) {
          .sw-main-content { margin-left: 240px; }
        }
        @media (max-width: 767px) {
          .sw-main-padding { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
