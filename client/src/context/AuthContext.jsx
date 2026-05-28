import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const refreshToken = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            setToken(null);
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const { data } = await api.get('/auth/session');
            setUser(data.user);
            setToken(storedToken);
        } catch (error) {
            // token is invalid
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        refreshToken();
    }, []);

    const login = async (email, password, role_type) => {
        const { data } = await api.post('/auth/login', { email, password, role_type });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };
    const logout = async () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };
    const value = { user, token, login, logout, loading, refreshToken };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return ctx;
}
