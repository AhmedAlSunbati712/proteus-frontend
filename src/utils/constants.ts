export const API_URL = import.meta.env.VITE_API_URL || "http://172.238.36.250";

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  HISTORY: '/history',
} as const;
