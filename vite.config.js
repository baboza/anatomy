import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-core': ['three'],
          'r3f-drei': ['@react-three/fiber', '@react-three/drei'],
          'firebase-sdk': ['firebase/app', 'firebase/auth', 'firebase/firestore/lite']
        }
      }
    }
  }
})
