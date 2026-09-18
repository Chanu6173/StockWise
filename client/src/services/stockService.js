import api from './api';

const stockService = {
  searchStocks: async (query) => {
    const response = await api.get(`/stocks/search?q=${query}`);
    return response.data;
  },

  getStockDetails: async (symbol, range = '1M') => {
    const response = await api.get(`/stocks/${symbol}?range=${range}`);
    return response.data;
  },
};

export default stockService;
