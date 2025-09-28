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
    sourcemap: true,
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1000kb
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // Create separate chunks for better caching and loading
          if (id.indexOf('node_modules') !== -1) {
            if (id.indexOf('react') !== -1 || id.indexOf('react-dom') !== -1) {
              return 'vendor-react';
            }
            if (id.indexOf('@reduxjs/toolkit') !== -1 || id.indexOf('react-redux') !== -1) {
              return 'vendor-redux';
            }
            if (id.indexOf('@fluentui') !== -1) {
              return 'vendor-fluentui';
            }
            if (id.indexOf('react-hook-form') !== -1 || id.indexOf('@hookform') !== -1 || id.indexOf('yup') !== -1) {
              return 'vendor-forms';
            }
            if (id.indexOf('axios') !== -1 || id.indexOf('crypto-js') !== -1) {
              return 'vendor-utils';
            }
            // Group other smaller vendor libraries
            return 'vendor';
          }
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