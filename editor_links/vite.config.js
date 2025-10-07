import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,  // This enables the manifest.json
    rollupOptions: {
      input: 'src/App.jsx'  // Adjust if your entry is different (e.g., src/index.jsx)
    }
  }
})
