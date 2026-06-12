import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API calls to backend at port 5454 (avoids CORS in dev)
      '/api': {
        target: 'http://localhost:5454',
        changeOrigin: true,
      },
    },
  },
})




