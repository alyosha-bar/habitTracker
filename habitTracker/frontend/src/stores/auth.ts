import { create } from 'zustand';

type AuthStore = {
    isAuthenticated: boolean;
    isHydrated: boolean;
    token: string | null;
    username: string | null;
    setAuthData: (token: string | null, username: string | null) => void;
    clearAuthData: () => void;
    finishHydration: () => void;
};

const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: false,
    isHydrated: false,
    token: null as string | null,
    username: null as string | null,
    setAuthData: (token, username) => {
        localStorage.setItem('token', token || '');
        localStorage.setItem('username', username || '');
        set({ 
            isAuthenticated: !!token, // Only true if token exists
            token, 
            username 
        });
    },
    clearAuthData: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        set({ isAuthenticated: false, token: null, username: null });
    },

    finishHydration: () => set({ isHydrated: true }),
}));

export default useAuthStore;