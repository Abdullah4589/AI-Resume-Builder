import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Bind IPv4 loopback explicitly. On Windows "localhost" resolves to ::1
    // first, and the API server binds IPv4 only — leaving the dev server and
    // the proxy target on different stacks.
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
});
