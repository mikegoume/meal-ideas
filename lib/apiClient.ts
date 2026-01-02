import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://devsassemble.ovh/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
