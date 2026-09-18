import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import stockService from '../services/stockService';
import portfolioService from '../services/portfolioService';
import watchlistService from '../services/watchlistService';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  ArrowLeft,
  Building2,
  Cpu,
} from 'lucide-react';

const CustomChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E2DA',
          borderRadius: 8,
          padding: '10px 14px',
          boxShadow: '0 4px 16px rgba(31,30,29,0.10)',
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', margin: '0 0 2px' }}>
          {payload[0].payload.date}
        </p>
        <p style={{ fontSize: 14, fontWeight: 800, color: '#1F1E1D', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
          ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: '#F4F3EE',
  border: '1px solid #E5E2DA',
  borderRadius: 8,
  color: '#1F1E1D',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  color: '#1F1E1D',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: 6,
};

const StockDetailsPage = () => {
  const { symbol } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('1M'); // 1W, 1M, 3M, 1Y

  // Quick Add Position Modal State
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    quantity: '',
    buyPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStockDetails = async () => {
    try {
      setLoading(true);
      const res = await stockService.getStockDetails(symbol, range);
      if (res.success) {
        setData(res.data);
        setFormData((prev) => ({
          ...prev,
          buyPrice: res.data.quote.price ? res.data.quote.price.toString() : '',
        }));
      }
    } catch (error) {
      toast.error('Failed to load stock details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockDetails();
  }, [symbol, range]);

  // Add stock position to portfolio
  const handleBuyStock = async (e) => {
    e.preventDefault();
    if (!formData.quantity || !formData.buyPrice) {
      return toast.error('Please enter quantity and buy price');
    }

    try {
      setIsSubmitting(true);
      const res = await portfolioService.addStock({
        symbol: symbol.toUpperCase(),
        companyName: data.profile.name,
        quantity: Number(formData.quantity),
        buyPrice: Number(formData.buyPrice),
        purchaseDate: formData.purchaseDate,
      });

      if (res.success) {
        toast.success(`Successfully added ${symbol.toUpperCase()} to portfolio`);
        setIsBuyModalOpen(false);
        setFormData({
          quantity: '',
          buyPrice: data.quote.price ? data.quote.price.toString() : '',
          purchaseDate: new Date().toISOString().split('T')[0],
        });
      }
    } catch (error) {
      toast.error('Failed to add to portfolio');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add stock to watchlist
  const handleAddToWatchlist = async () => {
    try {
      const res = await watchlistService.addToWatchlist({
        symbol: symbol.toUpperCase(),
        companyName: data.profile.name,
      });
      if (res.success) {
        toast.success(`Added ${symbol.toUpperCase()} to watchlist`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to watchlist');
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  const formatNumber = (val) => {
    if (!val) return '-';
    if (val >= 1e12) return `${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
    return val.toLocaleString();
  };

  const focusHandler = (e) => {
    e.target.style.borderColor = '#C15F3C';
    e.target.style.boxShadow = '0 0 0 3px rgba(193,95,60,0.15)';
    e.target.style.background = '#fff';
  };
  const blurHandler = (e) => {
    e.target.style.borderColor = '#E5E2DA';
    e.target.style.boxShadow = 'none';
    e.target.style.background = '#F4F3EE';
  };

  if (loading && !data) {
    return <Loader text={`Analyzing stock variables for ${symbol?.toUpperCase()}…`} />;
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: '#6B6762', marginBottom: 16 }}>Stock not found or API error occurred.</p>
        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#C15F3C',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const { quote = {}, profile = {}, history = [] } = data;
  const isUp = (quote.changePercent || 0) >= 0;

  // Chart data formatting
  const chartData = history.map((pt) => ({
    date: new Date(pt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: pt.price,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Back button and main header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: '#6B6762',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1F1E1D')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6B6762')}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleAddToWatchlist}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 16px',
              background: '#FFFFFF',
              border: '1px solid #E5E2DA',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: '#1F1E1D',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F4F3EE')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
          >
            <Eye size={15} /> Watch Ticker
          </button>
          <button
            onClick={() => setIsBuyModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 18px',
              background: '#C15F3C',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#A8512F')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#C15F3C')}
          >
            <Plus size={16} /> Add Position
          </button>
        </div>
      </div>

      {/* Main Profile / Price header row */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E2DA',
          borderRadius: 14,
          padding: '28px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          flexWrap: 'wrap',
          boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: 'rgba(193,95,60,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 800,
              color: '#C15F3C',
              fontFamily: 'inherit',
              flexShrink: 0,
            }}
          >
            {symbol.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1F1E1D', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
              {profile.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#6B6762' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Building2 size={14} style={{ color: '#B1ADA1' }} /> {profile.sector || 'N/A'}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Cpu size={14} style={{ color: '#B1ADA1' }} /> {profile.industry || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Prices block */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>
            CURRENT PRICE
          </p>
          <h3 style={{ fontSize: 32, fontWeight: 800, color: '#1F1E1D', margin: '0 0 4px', fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(quote.price)}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 99,
                background: isUp ? 'rgba(45,138,78,0.10)' : 'rgba(192,57,43,0.10)',
                color: isUp ? '#2D8A4E' : '#C0392B',
                border: `1px solid ${isUp ? 'rgba(45,138,78,0.20)' : 'rgba(192,57,43,0.20)'}`,
              }}
            >
              {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {isUp ? '+' : ''}
              {quote.changePercent?.toFixed(2)}%
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: isUp ? '#2D8A4E' : '#C0392B', fontVariantNumeric: 'tabular-nums' }}>
              {isUp ? '+' : ''}
              {formatCurrency(quote.change)}
            </span>
          </div>
        </div>
      </div>

      {/* Trailing Chart and Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        {/* Interactive Pricing Chart */}
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F1E1D', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Market Timeline
              </h3>
              <p style={{ fontSize: 12, color: '#B1ADA1', margin: 0 }}>Historical price intervals</p>
            </div>

            {/* Timeline Range selectors */}
            <div style={{ display: 'flex', background: '#F4F3EE', borderRadius: 8, padding: 3, border: '1px solid #E5E2DA' }}>
              {['1W', '1M', '3M', '1Y'].map((rng) => (
                <button
                  key={rng}
                  onClick={() => setRange(rng)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: range === rng ? '#FFFFFF' : 'transparent',
                    color: range === rng ? '#C15F3C' : '#6B6762',
                    boxShadow: range === rng ? '0 1px 3px rgba(31,30,29,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {rng}
                </button>
              ))}
            </div>
          </div>

          {/* Area Chart view */}
          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStockPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C15F3C" stopOpacity={0.20} />
                    <stop offset="95%" stopColor="#C15F3C" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEDE7" vertical={false} />
                <XAxis dataKey="date" stroke="#E5E2DA" tick={{ fontSize: 11, fill: '#B1ADA1' }} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#E5E2DA"
                  tick={{ fontSize: 11, fill: '#B1ADA1' }}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => `$${val}`}
                  width={50}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#C15F3C"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorStockPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics statistics card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E2DA',
            borderRadius: 12,
            padding: '24px',
            boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ borderBottom: '1px solid #E5E2DA', paddingBottom: 14, marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F1E1D', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Key Statistics
              </h3>
              <p style={{ fontSize: 12, color: '#B1ADA1', margin: 0 }}>Core financial valuation indicators</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, borderBottom: '1px solid #EFEDE7', paddingBottom: 8 }}>
                <span style={{ color: '#6B6762' }}>Market Capitalization</span>
                <span style={{ fontWeight: 700, color: '#1F1E1D', fontVariantNumeric: 'tabular-nums' }}>{formatNumber(profile.marketCap)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, borderBottom: '1px solid #EFEDE7', paddingBottom: 8 }}>
                <span style={{ color: '#6B6762' }}>Day High</span>
                <span style={{ fontWeight: 700, color: '#1F1E1D', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(quote.high)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, borderBottom: '1px solid #EFEDE7', paddingBottom: 8 }}>
                <span style={{ color: '#6B6762' }}>Day Low</span>
                <span style={{ fontWeight: 700, color: '#1F1E1D', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(quote.low)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, borderBottom: '1px solid #EFEDE7', paddingBottom: 8 }}>
                <span style={{ color: '#6B6762' }}>Open Price</span>
                <span style={{ fontWeight: 700, color: '#1F1E1D', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(quote.open)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span style={{ color: '#6B6762' }}>Previous Close</span>
                <span style={{ fontWeight: 700, color: '#1F1E1D', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(quote.previousClose)}</span>
              </div>
            </div>
          </div>

          {/* Quick Info disclaimer */}
          <div
            style={{
              background: '#F4F3EE',
              border: '1px solid #E5E2DA',
              borderRadius: 8,
              padding: '12px 14px',
              marginTop: 20,
            }}
          >
            <p style={{ fontSize: 11, color: '#6B6762', lineHeight: 1.5, margin: 0 }}>
              Price values are queried dynamically from market APIs. Trailing histories are simulated to facilitate display and audit controls.
            </p>
          </div>
        </div>
      </div>

      {/* QUICK BUY POSITION MODAL */}
      <Modal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        title={`Add Position (${symbol.toUpperCase()})`}
      >
        <form onSubmit={handleBuyStock}>
          <div
            style={{
              background: '#F4F3EE',
              border: '1px solid #E5E2DA',
              borderRadius: 8,
              padding: '14px 16px',
              marginBottom: 16,
            }}
          >
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1F1E1D', margin: '0 0 4px' }}>
              {profile.name}
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#6B6762' }}>Current Market Price:</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#C15F3C', fontVariantNumeric: 'tabular-nums' }}>
                {formatCurrency(quote.price)}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Quantity</label>
              <input
                type="number"
                min="1"
                placeholder="10"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Buy Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.buyPrice}
                onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Purchase Date</label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              style={inputStyle}
              onFocus={focusHandler}
              onBlur={blurHandler}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              background: isSubmitting ? '#D4896A' : '#C15F3C',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s ease',
            }}
          >
            {isSubmitting ? 'Recording Position…' : 'Add position'}
          </button>
        </form>
      </Modal>

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

export default StockDetailsPage;
