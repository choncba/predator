import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPluginModule from 'vite-plugin-monaco-editor';

const monacoEditorPlugin = (monacoEditorPluginModule as unknown as { default: typeof monacoEditorPluginModule }).default || monacoEditorPluginModule;

export default defineConfig({
  plugins: [
    react(),
    monacoEditorPlugin({}),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['redux', 'react-redux', 'redux-saga'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          monaco: ['monaco-editor'],
        },
      },
    },
  },
});
