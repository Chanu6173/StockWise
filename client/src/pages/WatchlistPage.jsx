import React, { useState, useEffect } from 'react';
import watchlistService from '../services/watchlistService';
import portfolioService from '../services/portfolioService';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import {
  Eye,
  Trash2,
  TrendingUp,
  TrendingDown,
  Plus,
  PlusCircle,
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

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Buy Modal state
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  // Search state to add ticker
  const [searchSymbol, setSearchSymbol] = useState('');
  const [searchCompany, setSearchCompany] = useState('');

  const [formData, setFormData] = useState({
    quantity: '',
    buyPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const res = await watchlistService.getWatchlist();
      if (res.success) {
        setWatchlist(res.data);
      }
    } catch (error) {
      toast.error('Failed to load watchlist');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  // Quick remove from watchlist
  const handleRemove = async (id, symbol) => {
    try {
      const res = await watchlistService.removeFromWatchlist(id);
      if (res.success) {
        toast.success(`Removed ${symbol} from watchlist`);
        fetchWatchlist();
      }
    } catch (error) {
      toast.error('Failed to remove from watchlist');
    }
  };

  // Add stock to watchlist
  const handleAddWatchlist = async (e) => {
    e.preventDefault();
    if (!searchSymbol || !searchCompany) {
      return toast.error('Please enter symbol and company name');
    }

    try {
      setIsSubmitting(true);
      const res = await watchlistService.addToWatchlist({
        symbol: searchSymbol.toUpperCase(),
        companyName: searchCompany,
      });

      if (res.success) {
        toast.success(`Added ${searchSymbol.toUpperCase()} to watchlist`);
        setSearchSymbol('');
        setSearchCompany('');
        fetchWatchlist();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to watchlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add to portfolio (Buy stock)
  const handleBuyStock = async (e) => {
    e.preventDefault();
    if (!formData.quantity || !formData.buyPrice) {
      return toast.error('Please enter quantity and buy price');
    }

    try {
      setIsSubmitting(true);
      const res = await portfolioService.addStock({
        symbol: selectedStock.symbol,
        companyName: selectedStock.companyName,
        quantity: Number(formData.quantity),
        buyPrice: Number(formData.buyPrice),
        purchaseDate: formData.purchaseDate,
      });

      if (res.success) {
        toast.success(`Successfully added ${selectedStock.symbol} to portfolio`);
        setIsBuyModalOpen(false);
        setFormData({
          quantity: '',
          buyPrice: '',
          purchaseDate: new Date().toISOString().split('T')[0],
        });
      }
    } catch (error) {
      toast.error('Failed to buy stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openBuyModal = (stock) => {
    setSelectedStock(stock);
    setFormData({
      quantity: '',
      buyPrice: stock.currentPrice ? stock.currentPrice.toString() : '',
      purchaseDate: new Date().toISOString().split('T')[0],
    });
    setIsBuyModalOpen(true);
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

  if (loading && watchlist.length === 0) {
    return <Loader text="Loading your watchlist positions…" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Watchlist Add Controls Header */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E2DA',
          borderRadius: 12,
          padding: '24px',
          boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1F1E1D', margin: '0 0 16px' }}>
          Add Ticker to Watchlist
        </h3>
        <form
          onSubmit={handleAddWatchlist}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
        >
          <input
            type="text"
            placeholder="Symbol (e.g. MSFT)"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
            style={{ ...inputStyle, flex: 1, minWidth: 140, textTransform: 'uppercase' }}
            onFocus={focusHandler}
            onBlur={blurHandler}
            required
          />
          <input
            type="text"
            placeholder="Company Name (e.g. Microsoft)"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            style={{ ...inputStyle, flex: 2, minWidth: 200 }}
            onFocus={focusHandler}
            onBlur={blurHandler}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 22px',
              background: '#C15F3C',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.background = '#A8512F')}
            onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.background = '#C15F3C')}
          >
            <Plus size={16} /> Watch
          </button>
        </form>
      </div>

      {/* Main Watchlist Cards Grid */}
      {watchlist.length === 0 ? (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E2DA',
            borderRadius: 12,
            padding: '60px 24px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
          }}
        >
          <Eye size={36} style={{ color: '#E5E2DA', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: '#1F1E1D', margin: '0 0 4px' }}>
            Your watchlist is currently empty
          </p>
          <p style={{ fontSize: 13, color: '#B1ADA1', margin: 0 }}>
            Keep track of stocks you are interested in before committing capital. Use the panel above to add tickers.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {watchlist.map((item) => {
            const isUp = (item.changePercent || 0) >= 0;
            return (
              <div
                key={item._id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E2DA',
                  borderRadius: 12,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 160,
                  boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C15F3C';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(31,30,29,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E2DA';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(31,30,29,0.04)';
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <h4 style={{ fontSize: 17, fontWeight: 800, color: '#1F1E1D', margin: '0 0 2px' }}>
                      {item.symbol}
                    </h4>
                    <p style={{ fontSize: 12, color: '#6B6762', margin: 0, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.companyName}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => openBuyModal(item)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 6,
                        background: 'rgba(193,95,60,0.10)',
                        color: '#C15F3C',
                        border: '1px solid rgba(193,95,60,0.20)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                      title="Quick Buy / Add to Portfolio"
                    >
                      <PlusCircle size={13} /> Buy
                    </button>
                    <button
                      onClick={() => handleRemove(item._id, item.symbol)}
                      style={{
                        padding: '6px',
                        borderRadius: 6,
                        background: '#F4F3EE',
                        color: '#B1ADA1',
                        border: '1px solid #E5E2DA',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Remove from Watchlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Pricing / Gain stats */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #EFEDE7',
                    paddingTop: 14,
                    marginTop: 14,
                  }}
                >
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>
                      LATEST PRICE
                    </p>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1F1E1D', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrency(item.currentPrice)}
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
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
                      {item.changePercent?.toFixed(2)}%
                    </span>
                    <p style={{ fontSize: 11, fontWeight: 700, color: isUp ? '#2D8A4E' : '#C0392B', margin: '3px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                      {isUp ? '+' : ''}
                      {formatCurrency(item.change)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK BUY MODAL */}
      <Modal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        title={`Quick Buy Position (${selectedStock?.symbol})`}
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
              {selectedStock?.companyName}
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#6B6762' }}>Current Market Price:</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#C15F3C', fontVariantNumeric: 'tabular-nums' }}>
                {formatCurrency(selectedStock?.currentPrice)}
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
            {isSubmitting ? 'Recording Buy…' : 'Buy Position'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default WatchlistPage;
