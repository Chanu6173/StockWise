import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DashboardCard = ({ title, value, change, changePercent, icon: Icon, isProfit = null }) => {
  const isPositive = change >= 0;

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E2DA',
        borderRadius: 12,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'box-shadow 0.2s ease',
        boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(31,30,29,0.08)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(31,30,29,0.04)')}
    >
      <div>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#B1ADA1',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: '0 0 8px',
          }}
        >
          {title}
        </p>
        <h3
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#1F1E1D',
            margin: '0 0 6px',
            letterSpacing: '-0.5px',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </h3>

        {changePercent !== undefined && changePercent !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                padding: '2px 8px',
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 700,
                background: isPositive ? 'rgba(45,138,78,0.10)' : 'rgba(192,57,43,0.10)',
                color: isPositive ? '#2D8A4E' : '#C0392B',
                border: `1px solid ${isPositive ? 'rgba(45,138,78,0.20)' : 'rgba(192,57,43,0.20)'}`,
              }}
            >
              {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {isPositive ? '+' : ''}{parseFloat(changePercent).toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            isProfit === true
              ? 'rgba(45,138,78,0.10)'
              : isProfit === false
              ? 'rgba(192,57,43,0.10)'
              : 'rgba(193,95,60,0.10)',
          color:
            isProfit === true
              ? '#2D8A4E'
              : isProfit === false
              ? '#C0392B'
              : '#C15F3C',
          flexShrink: 0,
        }}
      >
        <Icon size={22} />
      </div>
    </div>
  );
};

export default DashboardCard;
