import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,  // This enables the manifest.json
    rollupOptions: {
      input: 'src/main.jsx'  // Adjust if your entry is different (e.g., src/index.jsx)
    }
  },
  server: {
        proxy: {
            '/revisao': 'http://localhost:3000/revisao',
            '/uploads': 'http://localhost:3000/uploads',

        },
  }
})
