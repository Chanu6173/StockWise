import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import stockService from '../services/stockService';
import useDebounce from '../hooks/useDebounce';
import { Search, Loader2 } from 'lucide-react';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery.trim()) { setResults([]); return; }
      try {
        setLoading(true);
        const res = await stockService.searchStocks(debouncedQuery);
        if (res.success) setResults(res.data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };
    search();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (symbol) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/stock/${symbol.toLowerCase()}`);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#F4F3EE',
          border: '1px solid #E5E2DA',
          borderRadius: 8,
          padding: '8px 12px',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        {loading
          ? <Loader2 size={16} style={{ color: '#C15F3C', flexShrink: 0, animation: 'spin 0.8s linear infinite' }} />
          : <Search size={16} style={{ color: '#B1ADA1', flexShrink: 0 }} />
        }
        <input
          type="text"
          placeholder="Search stocks…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 14,
            color: '#1F1E1D',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {isOpen && query.trim() !== '' && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#FFFFFF',
            border: '1px solid #E5E2DA',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(31,30,29,0.10)',
            zIndex: 1000,
            maxHeight: 280,
            overflowY: 'auto',
          }}
        >
          {results.length === 0 ? (
            <div style={{ padding: '14px 16px', fontSize: 13, color: '#B1ADA1', textAlign: 'center' }}>
              {loading ? 'Searching…' : 'No results found'}
            </div>
          ) : (
            results.slice(0, 8).map((item) => (
              <button
                key={item.symbol}
                onClick={() => handleSelect(item.symbol)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '11px 16px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: '1px solid #EFEDE7',
                  fontFamily: 'inherit',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF9F5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#1F1E1D' }}>{item.symbol}</span>
                  <span style={{ marginLeft: 8, fontSize: 12, color: '#B1ADA1' }}>{item.description}</span>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    background: '#F4F3EE',
                    color: '#6B6762',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontWeight: 600,
                    border: '1px solid #E5E2DA',
                  }}
                >
                  {item.type || 'Stock'}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
