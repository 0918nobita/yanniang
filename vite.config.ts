import {
    vitePlugin as remix,
    cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev';
import { defineConfig } from 'vite';

export default defineConfig({
    clearScreen: false,
    plugins: [
        remixCloudflareDevProxy(),
        remix({
            future: {
                v3_fetcherPersist: true,
                v3_lazyRouteDiscovery: true,
                v3_relativeSplatPath: true,
                v3_singleFetch: true,
                v3_throwAbortReason: true,
            },
        }),
    ],
});