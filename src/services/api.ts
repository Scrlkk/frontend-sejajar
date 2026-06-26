import axios from 'axios';
import { setupInterceptors } from './interceptor';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

setupInterceptors();
