import axios from 'axios';
const api = axios.create({
    baseURL: (import.meta.env.VITE_BASE_API || 'http://localhost:4000') + '/api',
});

// Attach Auth token with all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
