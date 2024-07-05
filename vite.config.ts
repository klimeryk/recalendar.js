import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import i18nextLoader from 'vite-plugin-i18next-loader';

// https://vitejs.dev/config/
export default defineConfig( {
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
			'~': path.resolve( __dirname, 'src' ),
		},
	},
	worker: {
		plugins: () => [
			i18nextLoader( { paths: [ './src/locales' ], namespaceResolution: 'basename' } ),
			react(),
		],
	},
	server: {
		open: '/create.html',
	},
} );
