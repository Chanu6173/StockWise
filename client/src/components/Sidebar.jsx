import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  Eye,
  History,
  TrendingUp,
  User,
  LogOut,
  X,
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Watchlist', path: '/watchlist', icon: Eye },
    { name: 'Transactions', path: '/transactions', icon: History },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 240,
        background: '#FFFFFF',
        borderRight: '1px solid #E5E2DA',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
      }}
      className="sw-sidebar"
    >
      {/* Logo */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid #E5E2DA',
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
          <span style={{ fontSize: 17, fontWeight: 700, color: '#1F1E1D', letterSpacing: '-0.3px' }}>
            StockWise
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#B1ADA1',
            padding: 4,
            display: 'none',
          }}
          className="sw-sidebar-close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              marginBottom: 2,
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#C15F3C' : '#6B6762',
              background: isActive ? 'rgba(193,95,60,0.08)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              borderLeft: isActive ? '2px solid #C15F3C' : '2px solid transparent',
            })}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              if (!el.classList.contains('active')) {
                el.style.background = '#F4F3EE';
                el.style.color = '#1F1E1D';
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              if (!el.classList.contains('active')) {
                el.style.background = 'transparent';
                el.style.color = '#6B6762';
              }
            }}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {name}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ borderTop: '1px solid #E5E2DA', padding: '16px 12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(193,95,60,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#C15F3C',
              flexShrink: 0,
            }}
          >
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div style={{ overflow: 'hidden', minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1F1E1D', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'User'}
            </p>
            <p style={{ fontSize: 11, color: '#B1ADA1', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email || ''}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            color: '#C0392B',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(192,57,43,0.07)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .sw-sidebar { transform: translateX(0) !important; }
          .sw-sidebar-close { display: none !important; }
        }
        @media (max-width: 767px) {
          .sw-sidebar-close { display: block !important; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
