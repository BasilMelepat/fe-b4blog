import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:8080',
    baseURL: 'https://be-b4blog.vercel.app',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosInstance;