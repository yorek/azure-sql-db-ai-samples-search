import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';

const commitHash = execSync('git rev-parse --short HEAD').toString();
const commitDate = execSync('git log -1 --format=%cd --date=iso8601-strict').toString().trim();



// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __COMMIT_DATE__: JSON.stringify(commitDate),
  },
  plugins: [react()],
  server: {
    open: true, // Automatically open the browser on start
  },
});
