import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    isAuthenticated: boolean;
    user: null | { id: string; email: string; role: string; orgId: string };
    token: string | null;
    refreshToken: string | null;
    setAuth: (user: AuthState['user'], token: string, refreshToken: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null,
            setAuth: (user, token, refreshToken) => set({ isAuthenticated: true, user, token, refreshToken }),
            logout: () => set({ isAuthenticated: false, user: null, token: null, refreshToken: null }),
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
        }
    )
);
