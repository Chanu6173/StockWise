import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import AllocationChart from '../components/charts/AllocationChart';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import {
  Award,
  AlertOctagon,
  Percent,
  Layers,
  PieChart as PieIcon,
  ArrowRightLeft,
} from 'lucide-react';

const SECTOR_COLORS = [
  '#C15F3C',
  '#8B6E4E',
  '#5B8A6F',
  '#6B7FA3',
  '#A05C3C',
  '#C9A96E',
  '#7A8C6E',
];

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getAnalyticsData();
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      toast.error('Failed to load analytics data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  if (loading) {
    return <Loader text="Assembling stock analytics…" />;
  }

  if (!data) return null;

  const { summary = {}, bestPerformer, worstPerformer, sectorDistribution = [] } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Overview stats cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {/* Total Return Percent */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E2DA',
            borderRadius: 12,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
          }}
        >
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>
              Overall Return %
            </p>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 800,
                margin: 0,
                color: (summary.overallReturn || 0) >= 0 ? '#2D8A4E' : '#C0392B',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {(summary.overallReturn || 0) >= 0 ? '+' : ''}
              {(summary.overallReturnPercent || 0).toFixed(2)}%
            </h3>
          </div>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: (summary.overallReturn || 0) >= 0 ? 'rgba(45,138,78,0.10)' : 'rgba(192,57,43,0.10)',
              color: (summary.overallReturn || 0) >= 0 ? '#2D8A4E' : '#C0392B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Percent size={20} />
          </div>
        </div>

        {/* Avg Position Return */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E2DA',
            borderRadius: 12,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
          }}
        >
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>
              Avg Asset Return %
            </p>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 800,
                margin: 0,
                color: (summary.averageReturnPercent || 0) >= 0 ? '#2D8A4E' : '#C0392B',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {(summary.averageReturnPercent || 0) >= 0 ? '+' : ''}
              {(summary.averageReturnPercent || 0).toFixed(2)}%
            </h3>
          </div>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#F4F3EE',
              color: '#6B6762',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowRightLeft size={20} />
          </div>
        </div>

        {/* Total Cost */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E2DA',
            borderRadius: 12,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
          }}
        >
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>
              Capital Allocated
            </p>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#1F1E1D', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(summary.totalInvestment)}
            </h3>
          </div>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#F4F3EE',
              color: '#6B6762',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={20} />
          </div>
        </div>

        {/* Current Portfolio Valuation */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E2DA',
            borderRadius: 12,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
          }}
        >
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>
              Asset Valuation
            </p>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#1F1E1D', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(summary.currentValue)}
            </h3>
          </div>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'rgba(193,95,60,0.10)',
              color: '#C15F3C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PieIcon size={20} />
          </div>
        </div>
      </div>

      {/* Performers breakdown cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}
      >
        {/* Best Performer */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E2DA',
            borderRadius: 12,
            padding: '24px',
            boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
            borderLeft: '4px solid #2D8A4E',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Award size={18} style={{ color: '#2D8A4E' }} />
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#2D8A4E', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
              Top Performer
            </h3>
          </div>

          {bestPerformer ? (
            <div>
              <h4 style={{ fontSize: 22, fontWeight: 800, color: '#1F1E1D', margin: '0 0 2px' }}>
                {bestPerformer.symbol}
              </h4>
              <p style={{ fontSize: 13, color: '#6B6762', margin: '0 0 12px' }}>
                {bestPerformer.companyName}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: '#2D8A4E', fontVariantNumeric: 'tabular-nums' }}>
                  +{bestPerformer.profitPercent?.toFixed(2)}%
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#2D8A4E' }}>
                  (+{formatCurrency(bestPerformer.profit)})
                </span>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: '#B1ADA1', margin: 0, padding: '16px 0' }}>No return records to analyze</p>
          )}
        </div>

        {/* Worst Performer */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E2DA',
            borderRadius: 12,
            padding: '24px',
            boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
            borderLeft: '4px solid #C0392B',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <AlertOctagon size={18} style={{ color: '#C0392B' }} />
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#C0392B', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
              Bottom Performer
            </h3>
          </div>

          {worstPerformer ? (
            <div>
              <h4 style={{ fontSize: 22, fontWeight: 800, color: '#1F1E1D', margin: '0 0 2px' }}>
                {worstPerformer.symbol}
              </h4>
              <p style={{ fontSize: 13, color: '#6B6762', margin: '0 0 12px' }}>
                {worstPerformer.companyName}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: '#C0392B', fontVariantNumeric: 'tabular-nums' }}>
                  {worstPerformer.profitPercent?.toFixed(2)}%
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#C0392B' }}>
                  ({formatCurrency(worstPerformer.profit)})
                </span>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: '#B1ADA1', margin: 0, padding: '16px 0' }}>No return records to analyze</p>
          )}
        </div>
      </div>

      {/* Sector Allocation Breakdown */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E2DA',
          borderRadius: 12,
          padding: '24px',
          boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
        }}
      >
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1F1E1D', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Sector Weights
          </h3>
          <p style={{ fontSize: 12, color: '#B1ADA1', margin: 0 }}>Valuation-weighted industry diversification</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'center',
            gap: 24,
            marginTop: 20,
          }}
        >
          {/* Sector Pie Chart */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <AllocationChart data={sectorDistribution} />
          </div>

          {/* Sector weights list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sectorDistribution.length === 0 ? (
              <p style={{ fontSize: 13, color: '#B1ADA1', textAlign: 'center', padding: '24px 0', margin: 0 }}>
                No sectors to analyze
              </p>
            ) : (
              sectorDistribution.map((sector, index) => (
                <div
                  key={sector.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 13,
                    borderBottom: '1px solid #EFEDE7',
                    paddingBottom: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: SECTOR_COLORS[index % SECTOR_COLORS.length],
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontWeight: 600, color: '#1F1E1D' }}>{sector.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: '#1F1E1D', fontVariantNumeric: 'tabular-nums' }}>
                      {sector.percentage}%
                    </span>
                    <span style={{ color: '#B1ADA1', paddingLeft: 8, fontSize: 12 }}>
                      ({formatCurrency(sector.value)})
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
