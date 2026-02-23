export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  appTitle: import.meta.env.VITE_APP_TITLE as string,
  enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
