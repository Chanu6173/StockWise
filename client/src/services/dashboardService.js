import api from './api';

const dashboardService = {
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
};

export default dashboardService;
