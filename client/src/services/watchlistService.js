import api from './api';

const watchlistService = {
  getWatchlist: async () => {
    const response = await api.get('/watchlist');
    return response.data;
  },

  addToWatchlist: async (watchlistData) => {
    const response = await api.post('/watchlist', watchlistData);
    return response.data;
  },

  removeFromWatchlist: async (id) => {
    const response = await api.delete(`/watchlist/${id}`);
    return response.data;
  },
};

export default watchlistService;
