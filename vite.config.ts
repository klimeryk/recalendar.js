import { defineConfig } from 'vite'
import i18nextLoader from 'vite-plugin-i18next-loader'
// import commonjs from 'vite-plugin-commonjs'
import vitePluginRequire from "vite-plugin-require";
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [i18nextLoader({ paths: ['./src/locales'] }), vitePluginRequire.default(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
