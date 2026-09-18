import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const isPos = val >= 0;
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
      <p style={{ color: isPos ? '#2D8A4E' : '#C0392B', fontWeight: 700, margin: 0 }}>
        {isPos ? '+' : ''}${val?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
};

const ProfitChart = ({ data = [] }) => {
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
        No profit data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          tickFormatter={(v) => `$${v}`}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#E5E2DA" strokeWidth={1} />
        <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.profit >= 0 ? '#2D8A4E' : '#C0392B'}
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProfitChart;
