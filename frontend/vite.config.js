import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': backendUrl,
            '/nodes': backendUrl,
            '/traversal': backendUrl,
            '/chain': backendUrl,
        },
    },
});