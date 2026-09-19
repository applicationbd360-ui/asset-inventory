import api from './client';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  employeeCode: string | null;
  role: { id: number; name: string; displayName: string };
  department: { id: number; name: string } | null;
  permissions: string[];
}

export const authApi = {
  login: async (dto: LoginDto) => {
    const { data } = await api.post('/auth/login', dto);
    return data.data as { accessToken: string; user: AuthUser };
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  refresh: async () => {
    const { data } = await api.post('/auth/refresh');
    return data.data as { accessToken: string };
  },

  me: async () => {
    const { data } = await api.get('/auth/me');
    return data.data as AuthUser;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.put('/auth/change-password', { currentPassword, newPassword });
    return data;
  },
};
