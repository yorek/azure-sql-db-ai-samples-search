import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process';

execSync('git config --global --add safe.directory /github/workspace');

const commitHash = execSync('git rev-parse --short HEAD').toString();
const commitDate = execSync('git log -1 --format=%cd --date=iso8601-strict').toString().trim();

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
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1000kb
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-fluentui': ['@fluentui/react-components', '@fluentui/react-icons'],
        },
      },
    },
  },
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __COMMIT_DATE__: JSON.stringify(commitDate),
    // Ensure compatibility with Create React App's process.env usage
    'process.env': {},
  },
})