import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Backend URL
});

export default apiClient;
