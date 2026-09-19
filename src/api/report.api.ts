import { api } from './client';

export const reportApi = {
  getAssetDepreciationReport: async () => {
    const { data } = await api.get('/reports/asset-depreciation');
    return data.data;
  },
  
  getWorkOrderCostReport: async () => {
    const { data } = await api.get('/reports/work-order-costs');
    return data.data;
  },

  getInventoryValuationReport: async () => {
    const { data } = await api.get('/reports/inventory-valuation');
    return data.data;
  }
};
