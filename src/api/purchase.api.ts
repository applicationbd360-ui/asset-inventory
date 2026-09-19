import api from './client';

export const purchaseApi = {
  // Vendors
  getVendors: async () => {
    const { data } = await api.get('/purchase/vendors');
    return data.data;
  },
  
  // PRs
  getPrs: async () => {
    const { data } = await api.get('/purchase/pr');
    return data.data;
  },
  
  getPrById: async (id: number | string) => {
    const { data } = await api.get(`/purchase/pr/${id}`);
    return data.data;
  },
  
  createPr: async (payload: any) => {
    const { data } = await api.post('/purchase/pr', payload);
    return data.data;
  },
  
  submitPr: async (id: number | string) => {
    const { data } = await api.post(`/purchase/pr/${id}/submit`);
    return data.data;
  },
  
  approvePr: async (id: number | string) => {
    const { data } = await api.post(`/purchase/pr/${id}/approve`);
    return data.data;
  },

  // POs
  getPos: async () => {
    const { data } = await api.get('/purchase/po');
    return data.data;
  },

  createPo: async (payload: any) => {
    const { data } = await api.post('/purchase/po', payload);
    return data.data;
  },

  // GRNs
  getGrns: async () => {
    const { data } = await api.get('/purchase/grn');
    return data.data;
  },
  getGrnById: async (id: number) => {
    const res = await api.get(`/purchase/grn/${id}`);
    return res.data.data;
  },
  inspectGrnLine: async (lineId: number, data: any) => {
    const res = await api.put(`/purchase/grn/lines/${lineId}/inspect`, data);
    return res.data.data;
  },

  // ── RFQ ────────────────────────────────────────────────────────
  createRfq: async (data: { prId: number, dueDate: string, notes?: string }) => {
    const res = await api.post('/purchase/rfqs', data);
    return res.data.data;
  },
  getRfqs: async () => {
    const res = await api.get('/purchase/rfqs');
    return res.data.data;
  },
  getRfqById: async (id: number) => {
    const res = await api.get(`/purchase/rfqs/${id}`);
    return res.data.data;
  },
  addQuotation: async (rfqId: number, data: any) => {
    const res = await api.post(`/purchase/rfqs/${rfqId}/quotations`, data);
    return res.data.data;
  },
  selectVendor: async (rfqId: number, quotationId: number) => {
    const res = await api.post(`/purchase/rfqs/${rfqId}/select-vendor`, { quotationId });
    return res.data.data;
  }
};
