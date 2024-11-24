import { reactRouter } from '@react-router/dev/vite';
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

import { getLoadContext } from './load-context';

export default defineConfig({
    clearScreen: false,
    plugins: [
        tsConfigPaths(),
        ...(!process.env.VITEST
            ? [
                  cloudflareDevProxy({ persist: true, getLoadContext }),
                  reactRouter(),
              ]
            : [react()]),
    ],
});
