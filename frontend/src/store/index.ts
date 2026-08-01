import { create } from 'zustand';

interface AuthState {
    isAuthenticated: boolean;
    user: null | { id: string; email: string; role: string; orgId: string };
    token: string | null;
    setAuth: (user: AuthState['user'], token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    token: null,
    setAuth: (user, token) => set({ isAuthenticated: true, user, token }),
    logout: () => set({ isAuthenticated: false, user: null, token: null }),
}));
