// Centralized API configuration for PrepHub AI
const envUri = import.meta.env.VITE_CLIENT_URI;
const isDeadBackend = envUri && envUri.includes('prephub-ai-9761.vercel.app');

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]');

export const API_BASE_URL = (
  !envUri || isDeadBackend
    ? isLocalhost
      ? 'http://localhost:5000/api/'
      : 'https://prephub-ai.onrender.com/api/'
    : envUri
).replace(/\/+$/, '') + '/';

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '210805382032-pddbsivr12ir7s93qpeofnbvd6gvkihu.apps.googleusercontent.com';
