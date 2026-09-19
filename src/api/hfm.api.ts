import { api } from './client';

export const hfmApi = {
  // Utilities
  getUtilityMeters: async () => {
    const { data } = await api.get('/hfm/utilities/meters');
    return data.data;
  },
  addUtilityReading: async (payload: any) => {
    const { data } = await api.post('/hfm/utilities/readings', payload);
    return data.data;
  },

  // Waste Management
  getWasteLogs: async () => {
    const { data } = await api.get('/hfm/waste/logs');
    return data.data;
  },
  addWasteLog: async (payload: any) => {
    const { data } = await api.post('/hfm/waste/logs', payload);
    return data.data;
  },

  // Compliance
  getAudits: async () => {
    const { data } = await api.get('/hfm/compliance/audits');
    return data.data;
  }
};
