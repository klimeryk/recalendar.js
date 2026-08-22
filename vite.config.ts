import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import i18nextLoader from 'vite-plugin-i18next-loader';

const reactPlugin = () => react({ exclude: [/\/node_modules\//, /\/src\/pdf\//, /\/src\/worker\//] });

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: './index.html',
        app: './create.html',
        features: './features.html',
        faq: './faq.html',
      },
    },
  },
  plugins: [i18nextLoader({ paths: ['./src/locales'], namespaceResolution: 'basename' }), reactPlugin()],
  resolve: {
    alias: {
      '~': path.resolve(import.meta.dirname, 'src'),
    },
  },
  worker: {
    format: 'es',
    plugins: () => [i18nextLoader({ paths: ['./src/locales'], namespaceResolution: 'basename' }), reactPlugin()],
  },
});
