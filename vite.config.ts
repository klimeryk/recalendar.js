import { defineConfig } from 'vite'
import i18nextLoader from 'vite-plugin-i18next-loader'
import commonjs from 'vite-plugin-commonjs'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [commonjs(), i18nextLoader({ paths: ['./src/locales'], namespaceResolution: 'basename' }), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
