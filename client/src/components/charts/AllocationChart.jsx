import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#C15F3C',
  '#8B6E4E',
  '#5B8A6F',
  '#6B7FA3',
  '#A05C3C',
  '#C9A96E',
  '#7A8C6E',
];

const CustomTooltip = ({ active, payload }) => {
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
      <p style={{ color: '#1F1E1D', fontWeight: 700, margin: '0 0 2px' }}>{payload[0].name}</p>
      <p style={{ color: '#6B6762', margin: 0 }}>
        {payload[0].value?.toFixed(2)}%
      </p>
    </div>
  );
};

const AllocationChart = ({ data = [] }) => {
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
        No allocation data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={75}
          innerRadius={45}
          dataKey="value"
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#FAF9F5" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: 12, color: '#6B6762', fontWeight: 500 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AllocationChart;
