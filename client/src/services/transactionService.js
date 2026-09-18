import api from './api';

const transactionService = {
  getTransactions: async (params = {}) => {
    // params can hold { page, limit, search, type, sortBy, sortOrder }
    const response = await api.get('/transactions', { params });
    return response.data;
  },
};

export default transactionService;
