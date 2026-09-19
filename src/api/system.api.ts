import api from './client';

export const systemApi = {
  getNotifications: async () => {
    const { data } = await api.get('/system/notifications');
    return data; // { data: [...], unreadCount: number }
  },
  
  markNotificationRead: async (id: number) => {
    const { data } = await api.put(`/system/notifications/${id}/read`);
    return data.data;
  },

  getAuditLogs: async () => {
    const { data } = await api.get('/system/audit-logs');
    return data.data;
  },

  // Users
  getUsers: async () => {
    const { data } = await api.get('/system/users');
    return data.data;
  },
  createUser: async (payload: any) => {
    const { data } = await api.post('/system/users', payload);
    return data;
  },
  updateUser: async (id: number, payload: any) => {
    const { data } = await api.put(`/system/users/${id}`, payload);
    return data;
  },
  resetPassword: async (id: number, newPassword: string) => {
    const { data } = await api.put(`/system/users/${id}/reset-password`, { newPassword });
    return data;
  },
  deleteUser: async (id: number) => {
    const { data } = await api.delete(`/system/users/${id}`);
    return data;
  },

  // Roles
  getRoles: async () => {
    const { data } = await api.get('/system/roles');
    return data.data;
  },
  createRole: async (payload: any) => {
    const { data } = await api.post('/system/roles', payload);
    return data;
  },
  updateRole: async (id: number, payload: any) => {
    const { data } = await api.put(`/system/roles/${id}`, payload);
    return data;
  },
  deleteRole: async (id: number) => {
    const { data } = await api.delete(`/system/roles/${id}`);
    return data;
  }
};
