import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7059/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;