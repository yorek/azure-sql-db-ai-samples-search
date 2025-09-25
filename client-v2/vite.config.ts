import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Proxy API calls to your backend if needed
      '/data-api/rest': {
        target: 'http://localhost:4280/data-api/rest',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  define: {
    // Ensure compatibility with Create React App's process.env usage
    'process.env': {},
  },
})