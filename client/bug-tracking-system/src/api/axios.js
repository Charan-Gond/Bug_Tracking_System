import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Use proxy
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized (e.g., redirect to login)
            localStorage.removeItem('jwt');
            // window.location.href = '/login'; // Optional: Redirect
        }
        return Promise.reject(error);
    }
);

export default api;
