import { create } from 'zustand';
import { authService } from '../services/auth';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // True on initial load while we check session

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  login: async (username, password) => {
    const data = await authService.login(username, password);
    set({ user: data.user, isAuthenticated: true });
    return data;
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    try {
      const data = await authService.getMe();
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

export default useAuthStore;
