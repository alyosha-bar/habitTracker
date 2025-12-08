export const API_BASE =
  import.meta.env.MODE === 'development'
    ? '/api' // relative path for dev proxy
    : import.meta.env.VITE_SERVER_URL?.startsWith('http')
    ? import.meta.env.VITE_SERVER_URL
    : `https://${import.meta.env.VITE_SERVER_URL}`;