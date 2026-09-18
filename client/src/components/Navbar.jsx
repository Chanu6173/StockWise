import React from 'react';
import { Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SearchBox from './SearchBox';

const Navbar = ({ toggleSidebar, title = 'Dashboard' }) => {
  const { user } = useAuth();

  return (
    <header
      style={{
        height: 64,
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E2DA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#B1ADA1',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
          }}
          className="sw-menu-btn"
        >
          <Menu size={22} />
        </button>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#1F1E1D',
            margin: 0,
            letterSpacing: '-0.3px',
          }}
          className="sw-title"
        >
          {title}
        </h1>
      </div>

      <div style={{ flex: 1, maxWidth: 340, margin: '0 24px' }}>
        <SearchBox />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
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
          {user?.name ? user.name[0].toUpperCase() : <UserIcon size={15} />}
        </div>
        <span
          style={{ fontSize: 14, fontWeight: 500, color: '#1F1E1D' }}
          className="sw-username"
        >
          {user?.name || 'User'}
        </span>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .sw-menu-btn { display: none !important; }
        }
        @media (max-width: 640px) {
          .sw-title { display: none; }
          .sw-username { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
