import { create } from 'zustand';
import { User, ClientProfile } from '../types';

interface AuthState {
  user: User | null;
  profile: ClientProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  setProfile: (profile: ClientProfile) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,

  setAuth: (user, token, refreshToken) =>
    set({
      user,
      token,
      refreshToken: refreshToken || null,
      isAuthenticated: true,
      isLoading: false,
    }),

  setProfile: (profile) =>
    set({
      profile,
    }),

  logout: () =>
    set({
      user: null,
      profile: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
