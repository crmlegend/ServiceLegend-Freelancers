import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import path module for absolute paths

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Explicitly resolve 'lucide-react' to its node_modules path.
      // This helps Rollup find the module correctly during the build.
      'lucide-react': path.resolve(__dirname, 'node_modules/lucide-react'),
    },
  },
  build: {
    rollupOptions: {
      // Keep external empty, as lucide-react should be bundled.
      external: [],
    },
  },
})
