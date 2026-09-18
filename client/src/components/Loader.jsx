import React from 'react';

const Loader = ({ size = 'md', text = 'Loading…' }) => {
  const sizes = { sm: 24, md: 36, lg: 52 };
  const px = sizes[size] || 36;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        gap: 14,
      }}
    >
      <div
        style={{
          width: px,
          height: px,
          border: `3px solid #E5E2DA`,
          borderTopColor: '#C15F3C',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && (
        <p style={{ fontSize: 13, color: '#B1ADA1', fontWeight: 500, margin: 0 }}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
