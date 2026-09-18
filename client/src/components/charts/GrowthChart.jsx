import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E2DA',
        borderRadius: 8,
        padding: '10px 14px',
        boxShadow: '0 4px 16px rgba(31,30,29,0.10)',
        fontSize: 13,
      }}
    >
      <p style={{ color: '#B1ADA1', margin: '0 0 4px', fontSize: 11 }}>{label}</p>
      <p style={{ color: '#1F1E1D', fontWeight: 700, margin: 0 }}>
        ${payload[0].value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
};

const GrowthChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          height: 220,
          alignItems: 'center',
          justifyContent: 'center',
          color: '#B1ADA1',
          fontSize: 13,
        }}
      >
        No growth data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C15F3C" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#C15F3C" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#EFEDE7" vertical={false} />
        <XAxis
          dataKey="date"
          stroke="#E5E2DA"
          tick={{ fontSize: 11, fill: '#B1ADA1' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#E5E2DA"
          tick={{ fontSize: 11, fill: '#B1ADA1' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#C15F3C"
          strokeWidth={2}
          fill="url(#growthGradient)"
          dot={false}
          activeDot={{ r: 5, fill: '#C15F3C', strokeWidth: 2, stroke: '#fff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default GrowthChart;
