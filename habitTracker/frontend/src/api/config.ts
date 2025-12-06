export const API_BASE =
  import.meta.env.MODE === 'development'
    ? '/api' // dev
    : import.meta.env.VITE_SERVER_URL; // prod