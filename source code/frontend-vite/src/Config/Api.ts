import axios from 'axios';

// Uses VITE_API_URL env var in production (set in Vercel dashboard), falls back to localhost for dev
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5454";

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