import api from './api';

const portfolioService = {
  getPortfolio: async () => {
    const response = await api.get('/portfolio');
    return response.data;
  },

  addStock: async (stockData) => {
    const response = await api.post('/portfolio', stockData);
    return response.data;
  },

  updateStock: async (id, stockData) => {
    const response = await api.put(`/portfolio/${id}`, stockData);
    return response.data;
  },

  deleteStock: async (id) => {
    const response = await api.delete(`/portfolio/${id}`);
    return response.data;
  },
};

export default portfolioService;
