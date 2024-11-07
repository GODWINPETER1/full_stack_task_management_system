// src/utils/api.ts
import axios from 'axios';

const token = localStorage.getItem('accessToken')
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
});

export default apiClient;
