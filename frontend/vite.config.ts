import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";

import { getLoadContext } from "./loadContext";

export default defineConfig({
    clearScreen: false,
    plugins: [
        ...(!process.env.VITEST
            ? [
                  cloudflareDevProxy({ persist: true, getLoadContext }),
                  reactRouter(),
              ]
            : [react()]),
        tsConfigPaths(),
    ],
});
