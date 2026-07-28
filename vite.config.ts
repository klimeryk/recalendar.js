import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import i18nextLoader from 'vite-plugin-i18next-loader';

export default defineConfig( {
	build: {
		rollupOptions: {
			input: {
				main: './index.html',
				app: './create.html',
				features: './features.html',
				faq: './faq.html',
			},
		},
	},
	plugins: [
		i18nextLoader( { paths: [ './src/locales' ], namespaceResolution: 'basename' } ),
		react(),
	],
	resolve: {
		alias: {
			'~': path.resolve( __dirname, 'src' ),
		},
	},
	worker: {
		format: 'es',
		plugins: () => [
			i18nextLoader( { paths: [ './src/locales' ], namespaceResolution: 'basename' } ),
			react(),
		],
	},
} );
