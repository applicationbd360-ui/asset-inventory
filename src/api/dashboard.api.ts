import { api } from './client';

export const dashboardApi = {
  getSummary: async () => {
    const { data } = await api.get('/finance/dashboard/summary');
    return data.data;
  },
  getAnalytics: async () => {
    const { data } = await api.get('/finance/dashboard/analytics');
    return data.data;
  }
};
