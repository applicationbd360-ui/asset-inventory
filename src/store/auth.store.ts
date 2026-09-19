import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../api/auth.api';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user, token) => {
        localStorage.setItem('accessToken', token);
        set({ user, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, isAuthenticated: false });
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        if (!user) return false;
        const perms = user.permissions as string[];
        return perms.includes('*') || perms.includes(permission);
      },
    }),
    {
      name: 'assetiq-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
