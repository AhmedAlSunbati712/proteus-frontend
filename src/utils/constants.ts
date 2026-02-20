export const API_URL = import.meta.env.VITE_API_URL || "https://proteus-api.live";

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  HISTORY: '/history',
} as const;
