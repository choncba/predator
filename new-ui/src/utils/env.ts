export const env = {
  PREDATOR_URL: import.meta.env.VITE_PREDATOR_URL || '/v1',
  PREDATOR_DOCS_URL: import.meta.env.VITE_PREDATOR_DOCS_URL || 'https://zooz.github.io/predator',
  BUCKET_PATH: import.meta.env.VITE_BUCKET_PATH || '/ui/',
  VERSION: import.meta.env.VITE_VERSION || 'dev',
} as const;
