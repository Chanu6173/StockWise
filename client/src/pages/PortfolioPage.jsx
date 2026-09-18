import React, { useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';
import watchlistService from '../services/watchlistService';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Briefcase,
  PieChart as PieIcon,
  Eye,
} from 'lucide-react';

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

const PortfolioPage = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form state
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [formData, setFormData] = useState({
    symbol: '',
    companyName: '',
    quantity: '',
    buyPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch holdings on mount
  const fetchHoldings = async () => {
    try {
      setLoading(true);
      const res = await portfolioService.getPortfolio();
      if (res.success) {
        setHoldings(res.data);
      }
    } catch (error) {
      toast.error('Failed to load portfolio holdings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  // Calculate summary metrics
  const totalInvestment = holdings.reduce((sum, h) => sum + (h.totalInvestment || 0), 0);
  const currentValue = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
  const netProfit = currentValue - totalInvestment;
  const netProfitPercent = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

  // Add stock handler
  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!formData.symbol || !formData.companyName || !formData.quantity || !formData.buyPrice) {
      return toast.error('Please fill in all fields');
    }

    try {
      setIsSubmitting(true);
      const res = await portfolioService.addStock({
        symbol: formData.symbol.toUpperCase(),
        companyName: formData.companyName,
        quantity: Number(formData.quantity),
        buyPrice: Number(formData.buyPrice),
        purchaseDate: formData.purchaseDate,
      });

      if (res.success) {
        toast.success(`Successfully added ${formData.symbol.toUpperCase()} to portfolio`);
        setIsAddModalOpen(false);
        setFormData({
          symbol: '',
          companyName: '',
          quantity: '',
          buyPrice: '',
          purchaseDate: new Date().toISOString().split('T')[0],
        });
        fetchHoldings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit stock handler
  const handleEditStock = async (e) => {
    e.preventDefault();
    if (!formData.quantity || !formData.buyPrice) {
      return toast.error('Please enter quantity and buy price');
    }

    try {
      setIsSubmitting(true);
      const res = await portfolioService.updateStock(selectedHolding._id, {
        quantity: Number(formData.quantity),
        buyPrice: Number(formData.buyPrice),
        purchaseDate: formData.purchaseDate,
      });

      if (res.success) {
        toast.success(`Successfully updated ${selectedHolding.symbol}`);
        setIsEditModalOpen(false);
        fetchHoldings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete stock handler
  const handleDeleteStock = async () => {
    try {
      setIsSubmitting(true);
      const res = await portfolioService.deleteStock(selectedHolding._id);
      if (res.success) {
        toast.success(`Successfully liquidated ${selectedHolding.symbol}`);
        setIsDeleteModalOpen(false);
        fetchHoldings();
      }
    } catch (error) {
      toast.error('Failed to liquidate holding');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add stock to watchlist from holdings
  const handleAddToWatchlist = async (symbol, companyName) => {
    try {
      const res = await watchlistService.addToWatchlist({ symbol, companyName });
      if (res.success) {
        toast.success(`Added ${symbol} to watchlist`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Already in watchlist');
    }
  };

  const openEditModal = (holding) => {
    setSelectedHolding(holding);
    setFormData({
      symbol: holding.symbol,
      companyName: holding.companyName,
      quantity: holding.quantity,
      buyPrice: holding.buyPrice,
      purchaseDate: holding.purchaseDate ? holding.purchaseDate.split('T')[0] : '',
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (holding) => {
    setSelectedHolding(holding);
    setIsDeleteModalOpen(true);
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

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

  if (loading && holdings.length === 0) {
    return <Loader text="Retrieving portfolio positions…" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Portfolio overview statistics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}
      >
        {/* Total Investment Card */}
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
              Total Investment
            </p>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#1F1E1D', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(totalInvestment)}
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
            <DollarSign size={22} />
          </div>
        </div>

        {/* Current Valuation Card */}
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
              Current Valuation
            </p>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#1F1E1D', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(currentValue)}
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
            <Briefcase size={22} />
          </div>
        </div>

        {/* Profit/Loss Card */}
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
              Total Returns
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  margin: 0,
                  color: netProfit >= 0 ? '#2D8A4E' : '#C0392B',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {netProfit >= 0 ? '+' : ''}
                {formatCurrency(netProfit)}
              </h3>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 99,
                  background: netProfit >= 0 ? 'rgba(45,138,78,0.10)' : 'rgba(192,57,43,0.10)',
                  color: netProfit >= 0 ? '#2D8A4E' : '#C0392B',
                  border: `1px solid ${netProfit >= 0 ? 'rgba(45,138,78,0.20)' : 'rgba(192,57,43,0.20)'}`,
                }}
              >
                {netProfit >= 0 ? <TrendingUp size={11} style={{ marginRight: 3 }} /> : <TrendingDown size={11} style={{ marginRight: 3 }} />}
                {netProfitPercent.toFixed(2)}%
              </span>
            </div>
          </div>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: netProfit >= 0 ? 'rgba(45,138,78,0.10)' : 'rgba(192,57,43,0.10)',
              color: netProfit >= 0 ? '#2D8A4E' : '#C0392B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PieIcon size={22} />
          </div>
        </div>
      </div>

      {/* Main Table Layout */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E2DA',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
        }}
      >
        {/* Table Header Controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid #E5E2DA',
            background: '#FAF9F5',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1F1E1D', margin: '0 0 2px' }}>
              Assets Breakdown
            </h3>
            <p style={{ fontSize: 12, color: '#6B6762', margin: 0 }}>
              Manage and audit your current stock positions
            </p>
          </div>
          <button
            onClick={() => {
              setFormData({
                symbol: '',
                companyName: '',
                quantity: '',
                buyPrice: '',
                purchaseDate: new Date().toISOString().split('T')[0],
              });
              setIsAddModalOpen(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 18px',
              background: '#C15F3C',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#A8512F')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#C15F3C')}
          >
            <Plus size={16} /> Add Asset
          </button>
        </div>

        {/* Table body */}
        <div style={{ overflowX: 'auto' }}>
          {holdings.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Briefcase size={36} style={{ color: '#E5E2DA', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1F1E1D', margin: '0 0 4px' }}>
                Your portfolio is currently empty
              </p>
              <p style={{ fontSize: 13, color: '#B1ADA1', margin: 0 }}>
                Start tracking by recording your first buy operation. Click "Add Asset" to start.
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E2DA', background: '#FFFFFF' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Company / Symbol</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quantity</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Avg Cost</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Current Price</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Invested</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Current Value</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Profit / Loss</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, i) => {
                  const isGain = holding.profit >= 0;
                  return (
                    <tr
                      key={holding._id}
                      style={{
                        borderBottom: i < holdings.length - 1 ? '1px solid #EFEDE7' : 'none',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF9F5')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div>
                          <p style={{ fontWeight: 800, fontSize: 14, color: '#1F1E1D', margin: '0 0 2px' }}>{holding.symbol}</p>
                          <p style={{ fontSize: 12, color: '#6B6762', margin: 0, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {holding.companyName}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 600, color: '#1F1E1D', fontVariantNumeric: 'tabular-nums' }}>
                        {holding.quantity}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', color: '#6B6762', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(holding.buyPrice)}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', color: '#1F1E1D', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(holding.currentPrice)}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', color: '#6B6762', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(holding.totalInvestment)}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 700, color: '#1F1E1D', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(holding.currentValue)}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ fontWeight: 700, color: isGain ? '#2D8A4E' : '#C0392B', fontVariantNumeric: 'tabular-nums' }}>
                            {isGain ? '+' : ''}{formatCurrency(holding.profit)}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: isGain ? '#2D8A4E' : '#C0392B' }}>
                            {isGain ? '+' : ''}{holding.profitPercent?.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <button
                            onClick={() => handleAddToWatchlist(holding.symbol, holding.companyName)}
                            style={{
                              padding: '6px',
                              background: '#F4F3EE',
                              border: '1px solid #E5E2DA',
                              borderRadius: 6,
                              cursor: 'pointer',
                              color: '#6B6762',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            title="Add to Watchlist"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => openEditModal(holding)}
                            style={{
                              padding: '6px',
                              background: '#F4F3EE',
                              border: '1px solid #E5E2DA',
                              borderRadius: 6,
                              cursor: 'pointer',
                              color: '#6B6762',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            title="Edit Holding"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(holding)}
                            style={{
                              padding: '6px',
                              background: 'rgba(192,57,43,0.08)',
                              border: '1px solid rgba(192,57,43,0.18)',
                              borderRadius: 6,
                              cursor: 'pointer',
                              color: '#C0392B',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            title="Liquidate position"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ADD STOCK MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Stock Position"
      >
        <form onSubmit={handleAddStock}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Stock Symbol</label>
              <input
                type="text"
                placeholder="e.g. AAPL"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Company Name</label>
              <input
                type="text"
                placeholder="e.g. Apple Inc."
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
                required
              />
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
                placeholder="150.00"
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
            {isSubmitting ? 'Recording…' : 'Add Stock'}
          </button>
        </form>
      </Modal>

      {/* EDIT STOCK MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Stock Position (${formData.symbol})`}
      >
        <form onSubmit={handleEditStock}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Quantity</label>
              <input
                type="number"
                min="1"
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
            }}
          >
            {isSubmitting ? 'Updating…' : 'Save Changes'}
          </button>
        </form>
      </Modal>

      {/* LIQUIDATE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Liquidation"
      >
        <div>
          <p style={{ fontSize: 14, color: '#1F1E1D', margin: '0 0 12px' }}>
            Are you sure you want to liquidate your position in{' '}
            <strong style={{ color: '#C15F3C' }}>{selectedHolding?.symbol}</strong>?
          </p>
          <p
            style={{
              fontSize: 12,
              color: '#C0392B',
              background: 'rgba(192,57,43,0.08)',
              border: '1px solid rgba(192,57,43,0.20)',
              borderRadius: 8,
              padding: '12px 14px',
              lineHeight: 1.5,
              margin: '0 0 20px',
            }}
          >
            Warning: This operation will remove the stock from your holdings and log a SELL transaction in your history.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              style={{
                flex: 1,
                padding: '11px',
                background: '#F4F3EE',
                color: '#1F1E1D',
                border: '1px solid #E5E2DA',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteStock}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: '11px',
                background: '#C0392B',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {isSubmitting ? 'Liquidating…' : 'Liquidate Position'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PortfolioPage;
