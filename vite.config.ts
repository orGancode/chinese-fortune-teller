import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: []
    }
  },
  esbuild: {
    exclude: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**', '**/*.spec.ts', 'e2e/**']
  }
})
