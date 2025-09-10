import { reactRouter } from '@react-router/dev/vite';
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

import { getLoadContext } from './loadContext';

export default defineConfig({
    clearScreen: false,
    build: {
        minify: false,
    },
    plugins: [
        ...(!process.env.VITEST
            ? [
                  cloudflareDevProxy({
                      persist: true,
                      // biome-ignore lint/suspicious/noExplicitAny: 型が合わないため
                      getLoadContext: getLoadContext as any,
                  }),
                  reactRouter(),
              ]
            : [react()]),
        tsConfigPaths(),
        tailwindcss(),
    ],
});
