import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Removed 'lucide-react' from external.
      // It should be bundled with the application for client-side use.
      // The previous 'crypto.hash' error was due to Node.js version,
      // which is now handled by NODE_VERSION in GitHub Actions.
      external: [],
    },
  },
})
