import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ isSsrBuild }) => ({
    build: {
        rollupOptions: isSsrBuild
            ? { input: './app/app.server.ts' }
            : undefined,
    },
    clearScreen: false,
    plugins: [tsConfigPaths(), reactRouter()],
}));
