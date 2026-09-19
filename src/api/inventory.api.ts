import api from './client';

export const inventoryApi = {
  getItems: async () => {
    const { data } = await api.get('/inventory/items');
    return data.data;
  },

  createItem: async (payload: any) => {
    const { data } = await api.post('/inventory/items', payload);
    return data.data;
  },

  getLedger: async () => {
    const { data } = await api.get('/inventory/ledger');
    return data.data;
  },

  getForecastingData: async () => {
    const { data } = await api.get('/inventory/forecasting');
    return data.data;
  }
};
