import { create } from 'zustand';

type AuthStore = {
    isAuthenticated: boolean;
    token: string | null;
    username: string | null;
    setAuthData: (token: string | null, username: string | null) => void;
    clearAuthData: () => void;
};

const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: false,
    token: null as string | null,
    username: null as string | null,
    setAuthData: (token, username) => {
        localStorage.setItem('token', token || '');
        localStorage.setItem('username', username || '');
        set({ isAuthenticated: true, token, username });
    },
    clearAuthData: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        set({ isAuthenticated: false, token: null, username: null });
    },
}));

export default useAuthStore;