import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@components': path.resolve(__dirname, 'src/components'),
			'@styles': path.resolve(__dirname, 'src/styles'),
			'@': path.resolve(__dirname, 'src'),
		},
	},
	server: {
		// Forward contact-form requests to the local API app (npm run dev:api)
		proxy: {
			'/api': 'http://localhost:3001',
		},
	},
});
