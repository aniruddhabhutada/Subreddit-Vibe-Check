import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api/reddit-proxy': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/reddit-proxy/, ''),
        headers: {
          'User-Agent': 'web:subreddit-vibe-check:v1.0.0 (by /u/vibecheckapp)'
        }
      }
    }
  }
});
