import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import i18nextLoader from 'vite-plugin-i18next-loader';

export default defineConfig( {
	base: process.env.NODE_ENV === 'production' ? '/recalendar/' : '/',
	build: {
		rollupOptions: {
			input: {
				app: './create.html',
			},
		},
	},
	plugins: [
		i18nextLoader( { paths: [ './src/locales' ], namespaceResolution: 'basename' } ),
		react(),
	],
	resolve: {
		alias: {
			'~': fileURLToPath( new URL( 'src', import.meta.url ) ),
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
