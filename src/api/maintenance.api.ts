import api from './client';

export const maintenanceApi = {
  // Equipment
  getEquipments: async () => {
    const { data } = await api.get('/maintenance/equipment');
    return data.data;
  },

  getEquipmentById: async (id: number | string) => {
    const { data } = await api.get(`/maintenance/equipment/${id}`);
    return data.data;
  },
  updateEquipment: async (id: number | string, payload: any) => {
    const { data } = await api.patch(`/maintenance/equipment/${id}`, payload);
    return data.data;
  },
  generateEquipmentQr: async (id: number | string) => {
    const { data } = await api.get(`/maintenance/equipment/${id}/qr`);
    return data.data;
  },

  // Work Orders
  getWorkOrders: async () => {
    const { data } = await api.get('/maintenance/work-orders');
    return data.data;
  },

  createWorkOrder: async (payload: any) => {
    const { data } = await api.post('/maintenance/work-orders', payload);
    return data.data;
  },
  updateWoStatus: async (id: number, status: string, completionNotes?: string) => {
    const { data } = await api.put(`/maintenance/work-orders/${id}/status`, { status, completionNotes });
    return data.data;
  },
  addLabor: async (id: number, payload: any) => {
    const { data } = await api.post(`/maintenance/work-orders/${id}/labor`, payload);
    return data.data;
  },
  addMaterial: async (id: number, payload: any) => {
    const { data } = await api.post(`/maintenance/work-orders/${id}/materials`, payload);
    return data.data;
  },
  addService: async (id: number, payload: any) => {
    const { data } = await api.post(`/maintenance/work-orders/${id}/services`, payload);
    return data.data;
  },
  closeWorkOrder: async (id: number) => {
    const { data } = await api.post(`/maintenance/work-orders/${id}/close`);
    return data.data;
  },
  createCommissioningWo: async (equipmentId: number) => {
    const { data } = await api.post('/maintenance/work-orders/commissioning', { equipmentId });
    return data.data;
  },
  updateWorkOrderStatus: async (id: number | string, status: string, completionNotes?: string) => {
    const { data } = await api.patch(`/maintenance/work-orders/${id}/status`, { status, completionNotes });
    return data.data;
  },
  updateWoChecklist: async (id: number | string, checklist: any[], status: string) => {
    const { data } = await api.patch(`/maintenance/work-orders/${id}/checklist`, { checklist, status });
    return data.data;
  },

  // PM Plans
  getPmPlans: async () => {
    const { data } = await api.get('/maintenance/pm-plans');
    return data.data;
  },
  getPmPlanById: async (id: number | string) => {
    const { data } = await api.get(`/maintenance/pm-plans/${id}`);
    return data.data;
  },
  getPmPlansByEquipment: async (equipmentId: number | string) => {
    const { data } = await api.get(`/maintenance/pm-plans/equipment/${equipmentId}`);
    return data.data;
  },
  createPmPlan: async (payload: any) => {
    const { data } = await api.post('/maintenance/pm-plans', payload);
    return data.data;
  },
  updatePmPlan: async (id: number | string, payload: any) => {
    const { data } = await api.patch(`/maintenance/pm-plans/${id}`, payload);
    return data.data;
  },
  deletePmPlan: async (id: number | string) => {
    const { data } = await api.delete(`/maintenance/pm-plans/${id}`);
    return data;
  }
};
