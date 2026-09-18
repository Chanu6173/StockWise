const axios = require('axios');
const NodeCache = require('node-cache');

// Cache quotes for 2 minutes to respect rate limits
const cache = new NodeCache({ stdTTL: 120 });

const getMockQuote = (symbol) => {
  const seed = symbol.charCodeAt(0) + (symbol.charCodeAt(1) || 0);
  const basePrice = (seed % 150) + 50; // Generate stable mock price
  const change = ((seed % 10) - 5) + Math.random() * 2;
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol: symbol.toUpperCase(),
    price: parseFloat((basePrice + change).toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    high: parseFloat((basePrice * 1.05).toFixed(2)),
    low: parseFloat((basePrice * 0.95).toFixed(2)),
    open: parseFloat(basePrice.toFixed(2)),
    previousClose: parseFloat((basePrice - 0.5).toFixed(2)),
  };
};

const getMockProfile = (symbol) => {
  const symbolUpper = symbol.toUpperCase();
  const profiles = {
    AAPL: { name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics', marketCap: 3000000000000 },
    MSFT: { name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software—Infrastructure', marketCap: 3200000000000 },
    GOOGL: { name: 'Alphabet Inc.', sector: 'Communication Services', industry: 'Internet Content & Information', marketCap: 2000000000000 },
    AMZN: { name: 'Amazon.com, Inc.', sector: 'Consumer Cyclical', industry: 'Internet Retail', marketCap: 1800000000000 },
    TSLA: { name: 'Tesla, Inc.', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', marketCap: 600000000000 },
    NVDA: { name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors', marketCap: 2200000000000 },
  };

  if (profiles[symbolUpper]) {
    return { symbol: symbolUpper, ...profiles[symbolUpper] };
  }

  // Default fallback profile
  return {
    symbol: symbolUpper,
    name: `${symbolUpper} Corporation`,
    sector: 'Financial',
    industry: 'Stock Portfolio Asset',
    marketCap: 50000000000,
  };
};

const stockService = {
  // Fetch current price for a symbol
  getQuote: async (symbol) => {
    const sym = symbol.toUpperCase();
    const cachedData = cache.get(`quote_${sym}`);
    if (cachedData) return cachedData;

    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
      const mockQuote = getMockQuote(sym);
      cache.set(`quote_${sym}`, mockQuote);
      return mockQuote;
    }

    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${apiKey}`
      );
      
      const data = response.data;
      // Finnhub quote format: c = current, d = change, dp = percent change, h = high, l = low, o = open, pc = prev close
      if (!data.c) {
        throw new Error('No data returned from API');
      }

      const quote = {
        symbol: sym,
        price: data.c,
        change: data.d,
        changePercent: data.dp,
        high: data.h,
        low: data.l,
        open: data.o,
        previousClose: data.pc,
      };

      cache.set(`quote_${sym}`, quote);
      return quote;
    } catch (error) {
      console.error(`Error fetching quote for ${sym}:`, error.message);
      // Fallback to mock on API error
      return getMockQuote(sym);
    }
  },

  // Get company profile information
  getCompanyProfile: async (symbol) => {
    const sym = symbol.toUpperCase();
    const cachedData = cache.get(`profile_${sym}`);
    if (cachedData) return cachedData;

    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
      const mockProfile = getMockProfile(sym);
      cache.set(`profile_${sym}`, mockProfile);
      return mockProfile;
    }

    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/stock/profile2?symbol=${sym}&token=${apiKey}`
      );

      const data = response.data;
      if (!data.name) {
        return getMockProfile(sym);
      }

      const profile = {
        symbol: sym,
        name: data.name,
        sector: data.finnhubIndustry || 'Technology',
        industry: data.finnhubIndustry || 'Software',
        marketCap: data.marketCapitalization ? data.marketCapitalization * 1000000 : 10000000000,
        logo: data.logo,
      };

      cache.set(`profile_${sym}`, profile);
      return profile;
    } catch (error) {
      console.error(`Error fetching profile for ${sym}:`, error.message);
      return getMockProfile(sym);
    }
  },

  // Search symbols
  searchStocks: async (query) => {
    if (!query) return [];
    
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
      // Mock search results
      const mockStocks = [
        { symbol: 'AAPL', description: 'APPLE INC', type: 'Common Stock' },
        { symbol: 'MSFT', description: 'MICROSOFT CORP', type: 'Common Stock' },
        { symbol: 'GOOGL', description: 'ALPHABET INC-CL A', type: 'Common Stock' },
        { symbol: 'AMZN', description: 'AMAZON.COM INC', type: 'Common Stock' },
        { symbol: 'TSLA', description: 'TESLA INC', type: 'Common Stock' },
        { symbol: 'NVDA', description: 'NVIDIA CORP', type: 'Common Stock' },
      ];
      return mockStocks.filter(
        (s) =>
          s.symbol.includes(query.toUpperCase()) ||
          s.description.includes(query.toUpperCase())
      );
    }

    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/search?q=${query}&token=${apiKey}`
      );
      
      return (response.data.result || []).map((item) => ({
        symbol: item.symbol,
        description: item.description,
        type: item.type,
      }));
    } catch (error) {
      console.error('Error searching stocks:', error.message);
      return [];
    }
  },

  // Historical data for charts
  getHistoricalData: async (symbol, range = '1M') => {
    const sym = symbol.toUpperCase();
    const cachedData = cache.get(`history_${sym}_${range}`);
    if (cachedData) return cachedData;

    // We'll mock historical data since it needs twelve data or premium finnhub.
    // This allows full chart rendering immediately.
    const dataPoints = [];
    const now = new Date();
    let days = 30;
    if (range === '1W') days = 7;
    else if (range === '3M') days = 90;
    else if (range === '1Y') days = 365;

    const baseQuote = getMockQuote(sym);
    let currentPrice = baseQuote.price;

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Small random walk
      const change = (Math.random() - 0.48) * (currentPrice * 0.03);
      currentPrice = parseFloat((currentPrice + change).toFixed(2));

      dataPoints.push({
        date: date.toISOString().split('T')[0],
        price: currentPrice,
      });
    }

    cache.set(`history_${sym}_${range}`, dataPoints, 300); // cache history for 5 mins
    return dataPoints;
  },
};

module.exports = stockService;
