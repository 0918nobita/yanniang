import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    clearScreen: false,
    plugins: [tsConfigPaths(), reactRouter()],
});
