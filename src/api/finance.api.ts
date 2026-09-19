import api from './client';

export const financeApi = {
  // Assets
  getAssets: async () => {
    const { data } = await api.get('/finance/assets');
    return data.data;
  },

  getAssetById: async (id: number | string) => {
    const { data } = await api.get(`/finance/assets/${id}`);
    return data.data;
  },

  getAssetQrCode: async (id: number | string) => {
    const { data } = await api.get(`/finance/assets/${id}/qrcode`);
    return data.data;
  },

  capitalizeAsset: async (payload: any) => {
    const { data } = await api.post('/finance/assets/capitalize', payload);
    return data.data;
  },

  // Journals
  getJournals: async () => {
    const { data } = await api.get('/finance/journals');
    return data.data;
  },

  createJournal: async (payload: { description: string, amount: number }) => {
    const { data } = await api.post('/finance/journals', payload);
    return data.data;
  },

  getJournalById: async (id: number | string) => {
    const { data } = await api.get(`/finance/journals/${id}`);
    return data.data;
  },

  runDepreciation: async (year: number, month: number) => {
    const { data } = await api.post('/finance/depreciation/run', { year, month });
    return data;
  },

  // Metadata
  getChartOfAccounts: async () => {
    const { data } = await api.get('/finance/gl-accounts');
    return data.data;
  },

  getAssetClasses: async () => {
    const { data } = await api.get('/finance/asset-classes');
    return data.data;
  },

  // Budget
  getMroForecast: async () => {
    const { data } = await api.get('/finance/budgets/mro-forecast');
    return data.data;
  }
};
