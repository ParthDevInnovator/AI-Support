import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Auth interceptor to attach JWT
api.interceptors.request.use((config) => {
    // We'll manage tokens via cookies or Zustand (if memory) later.
    // For now, this is a placeholder where JWT retrieval would happen.
    // const token = useStore.getState().token;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized globally here in the future
        return Promise.reject(error);
    }
);

export default api;
