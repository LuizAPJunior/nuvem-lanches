import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      __APP_API_URL__: JSON.stringify(env.VITE_API_URL),
    },
    server: {
      proxy: {
        // Forward /auth and /api to Express so cookies work on same origin
        '/auth': { target: env.VITE_API_URL, changeOrigin: true },
        '/api':  { target: env.VITE_API_URL, changeOrigin: true },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/setupTests.js',
    }
    }
})
