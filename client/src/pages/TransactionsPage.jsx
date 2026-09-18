import React, { useState, useEffect } from 'react';
import transactionService from '../services/transactionService';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import {
  History,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter / Query state
  const [search, setSearch] = useState('');
  const [type, setType] = useState(''); // '', 'BUY', 'SELL'
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await transactionService.getTransactions({
        page,
        limit,
        search,
        type,
        sortBy,
        sortOrder,
      });

      if (res.success) {
        setTransactions(res.data);
        setTotalPages(res.pagination.pages || 1);
        setTotalItems(res.pagination.total || 0);
      }
    } catch (error) {
      toast.error('Failed to load transaction logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when query params change
  useEffect(() => {
    fetchTransactions();
  }, [page, type, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page
    fetchTransactions();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Filtering Control Bar */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E2DA',
          borderRadius: 12,
          padding: '20px 24px',
          boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
        }}
      >
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
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', flex: 1, minWidth: 260, maxWidth: 380 }}>
            <input
              type="text"
              placeholder="Search ticker or company name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                background: '#F4F3EE',
                border: '1px solid #E5E2DA',
                borderRadius: 8,
                color: '#1F1E1D',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={focusHandler}
              onBlur={blurHandler}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 12,
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
                color: '#B1ADA1',
              }}
            >
              <Search size={16} />
            </div>
            <button type="submit" style={{ display: 'none' }}>Search</button>
          </form>

          {/* Filter dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B6762' }}>
              <Filter size={15} />
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Type:</span>
            </div>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '9px 14px',
                background: '#F4F3EE',
                border: '1px solid #E5E2DA',
                borderRadius: 8,
                color: '#1F1E1D',
                fontSize: 13,
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
              onFocus={focusHandler}
              onBlur={blurHandler}
            >
              <option value="">All Transactions</option>
              <option value="BUY">BUY Orders</option>
              <option value="SELL">SELL Orders</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E2DA',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          {loading && transactions.length === 0 ? (
            <Loader text="Retrieving transaction journals…" />
          ) : transactions.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <History size={36} style={{ color: '#E5E2DA', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1F1E1D', margin: '0 0 4px' }}>No transactions found</p>
              <p style={{ fontSize: 13, color: '#B1ADA1', margin: 0 }}>
                No orders match your current filter parameters or your order logs are empty.
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E2DA', background: '#FAF9F5' }}>
                  <th
                    style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer' }}
                    onClick={() => handleSort('date')}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      Transaction Date <ArrowUpDown size={12} />
                    </span>
                  </th>
                  <th
                    style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer' }}
                    onClick={() => handleSort('symbol')}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      Asset Ticker <ArrowUpDown size={12} />
                    </span>
                  </th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Company
                  </th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Operation
                  </th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Quantity
                  </th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Price Per Share
                  </th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#B1ADA1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => {
                  const isBuy = tx.type === 'BUY';
                  return (
                    <tr
                      key={tx._id}
                      style={{
                        borderBottom: i < transactions.length - 1 ? '1px solid #EFEDE7' : 'none',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF9F5')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '15px 20px', color: '#6B6762', fontVariantNumeric: 'tabular-nums' }}>
                        {formatDate(tx.date)}
                      </td>
                      <td style={{ padding: '15px 20px', fontWeight: 800, color: '#1F1E1D' }}>
                        {tx.symbol}
                      </td>
                      <td style={{ padding: '15px 20px', color: '#6B6762', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tx.companyName}
                      </td>
                      <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 99,
                            background: isBuy ? 'rgba(45,138,78,0.10)' : 'rgba(192,57,43,0.10)',
                            color: isBuy ? '#2D8A4E' : '#C0392B',
                            border: `1px solid ${isBuy ? 'rgba(45,138,78,0.20)' : 'rgba(192,57,43,0.20)'}`,
                          }}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td style={{ padding: '15px 20px', textAlign: 'right', fontWeight: 600, color: '#1F1E1D', fontVariantNumeric: 'tabular-nums' }}>
                        {tx.quantity}
                      </td>
                      <td style={{ padding: '15px 20px', textAlign: 'right', color: '#6B6762', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(tx.price)}
                      </td>
                      <td
                        style={{
                          padding: '15px 20px',
                          textAlign: 'right',
                          fontWeight: 700,
                          fontVariantNumeric: 'tabular-nums',
                          color: isBuy ? '#2D8A4E' : '#C0392B',
                        }}
                      >
                        {isBuy ? '-' : '+'}{formatCurrency(tx.totalAmount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Control Bar */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderTop: '1px solid #E5E2DA',
              background: '#FAF9F5',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 13, color: '#6B6762' }}>
              Showing <strong style={{ color: '#1F1E1D' }}>{transactions.length}</strong> of{' '}
              <strong style={{ color: '#1F1E1D' }}>{totalItems}</strong> orders
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '7px 12px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E2DA',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: page === 1 ? '#B1ADA1' : '#1F1E1D',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span style={{ fontSize: 12, color: '#6B6762', padding: '0 4px' }}>
                Page <strong style={{ color: '#1F1E1D' }}>{page}</strong> of{' '}
                <strong style={{ color: '#1F1E1D' }}>{totalPages}</strong>
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '7px 12px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E2DA',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: page === totalPages ? '#B1ADA1' : '#1F1E1D',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
