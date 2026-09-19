import api from './client';

export const analyticsApi = {
  getCostsByWorkCenter: async () => {
    const { data } = await api.get('/analytics/costs-by-work-center');
    return data.data;
  },

  getDamagesByCause: async () => {
    const { data } = await api.get('/analytics/damages-by-cause');
    return data.data;
  },

  getOrdersForPlanning: async () => {
    const { data } = await api.get('/analytics/orders-for-planning');
    return data.data;
  }
};
