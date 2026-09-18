import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import DashboardCard from '../components/DashboardCard';
import GrowthChart from '../components/charts/GrowthChart';
import AllocationChart from '../components/charts/AllocationChart';
import ProfitChart from '../components/charts/ProfitChart';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Layers,
  History,
  ArrowRight,
} from 'lucide-react';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getDashboardData();
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard overview');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  if (loading) {
    return <Loader text="Loading dashboard metrics…" />;
  }

  if (!data) return null;

  const { summary = {}, charts = {}, recentTransactions = [] } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E2DA',
          borderRadius: 12,
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#1F1E1D',
              margin: '0 0 4px',
              letterSpacing: '-0.4px',
            }}
          >
            Portfolio Overview
          </h2>
          <p style={{ fontSize: 13, color: '#6B6762', margin: 0 }}>
            Real-time analytics and performance tracking for your active stock holdings
          </p>
        </div>

        <Link
          to="/portfolio"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 18px',
            background: '#C15F3C',
            color: '#ffffff',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#A8512F')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#C15F3C')}
        >
          Manage Holdings <ArrowRight size={15} />
        </Link>
      </div>

      {/* Overview Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        <DashboardCard
          title="Portfolio Valuation"
          value={formatCurrency(summary.portfolioValue)}
          icon={Briefcase}
        />
        <DashboardCard
          title="Total Investment"
          value={formatCurrency(summary.totalInvestment)}
          icon={DollarSign}
        />
        <DashboardCard
          title="Today's Gain"
          value={formatCurrency(summary.todayGain)}
          changePercent={summary.todayGainPercent}
          change={summary.todayGain}
          icon={TrendingUp}
          isProfit={summary.todayGain >= 0}
        />
        <DashboardCard
          title="Overall Return"
          value={formatCurrency(summary.overallProfit)}
          changePercent={summary.overallProfitPercent}
          change={summary.overallProfit}
          icon={Layers}
          isProfit={summary.overallProfit >= 0}
        />
      </div>

      {/* Grid of charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        {/* Growth line chart */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E2DA',
            borderRadius: 12,
            padding: '24px',
            gridColumn: 'span 2',
            boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
          }}
          className="sw-chart-span-2"
        >
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F1E1D', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Value Growth Trend
            </h3>
            <p style={{ fontSize: 12, color: '#B1ADA1', margin: 0 }}>Estimated 7-day trailing portfolio performance</p>
          </div>
          <GrowthChart data={charts.growthTrend || []} />
        </div>

        {/* Allocation pie chart */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E2DA',
            borderRadius: 12,
            padding: '24px',
            boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F1E1D', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Asset Allocation
            </h3>
            <p style={{ fontSize: 12, color: '#B1ADA1', margin: 0 }}>Distribution weighting by symbol value</p>
          </div>
          <AllocationChart data={charts.allocation || []} />
        </div>
      </div>

      {/* Profit Distribution Bar Chart & Recent Operations */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E2DA',
            borderRadius: 12,
            padding: '24px',
            gridColumn: 'span 2',
            boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
          }}
          className="sw-chart-span-2"
        >
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F1E1D', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Margin Distribution
            </h3>
            <p style={{ fontSize: 12, color: '#B1ADA1', margin: 0 }}>Absolute dollar gains/losses across positions</p>
          </div>
          <ProfitChart data={charts.profitDistribution || []} />
        </div>

        {/* Recent Transactions list */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E2DA',
            borderRadius: 12,
            padding: '24px',
            boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #E5E2DA',
              paddingBottom: 14,
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#1F1E1D',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <History size={16} style={{ color: '#C15F3C' }} /> Recent Operations
            </h3>
            <Link
              to="/transactions"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#C15F3C',
                textDecoration: 'none',
              }}
            >
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            {!recentTransactions || recentTransactions.length === 0 ? (
              <p style={{ fontSize: 13, color: '#B1ADA1', textAlign: 'center', margin: 'auto 0', padding: '24px 0' }}>
                No transactions recorded yet
              </p>
            ) : (
              recentTransactions.map((tx) => {
                const isBuy = tx.type === 'BUY';
                return (
                  <div
                    key={tx._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #EFEDE7',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1F1E1D', margin: '0 0 2px' }}>{tx.symbol}</p>
                      <p style={{ fontSize: 11, color: '#B1ADA1', margin: 0 }}>
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                          marginBottom: 3,
                          background: isBuy ? 'rgba(45,138,78,0.10)' : 'rgba(192,57,43,0.10)',
                          color: isBuy ? '#2D8A4E' : '#C0392B',
                          border: `1px solid ${isBuy ? 'rgba(45,138,78,0.20)' : 'rgba(192,57,43,0.20)'}`,
                        }}
                      >
                        {tx.type}
                      </span>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#1F1E1D', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                        {tx.quantity} @ {formatCurrency(tx.price)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .sw-chart-span-2 {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
