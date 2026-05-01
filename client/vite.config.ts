import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [react(), tailwindcss()],
	publicDir: '../public',
	build: { copyPublicDir: false },
	server: {
		proxy: {
			'^/$': 'http://localhost:3000',
			'/api': 'http://localhost:3000',
			'/login': 'http://localhost:3000',
			'/logout': 'http://localhost:3000',
			'/signup': 'http://localhost:3000',
			'/accept-invite': 'http://localhost:3000',
			'/billing': 'http://localhost:3000',
			'/privacy': 'http://localhost:3000',
			'/terms': 'http://localhost:3000',
			'/features': 'http://localhost:3000',
			'/pricing': 'http://localhost:3000',
			'/contact': 'http://localhost:3000',
		},
	},
});
