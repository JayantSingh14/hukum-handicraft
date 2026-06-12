import axios from 'axios';

// Backend runs on port 5454 (see application.properties: server.port=5454)
export const API_URL = "http://localhost:5454";
export const DEPLOYED_URL = "https://zosh-bazzar-backend.onrender.com"

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const jwt = localStorage.getItem('jwt');
  if (jwt) {
    config.headers['Authorization'] = `Bearer ${jwt}`;
  }
  return config;
});