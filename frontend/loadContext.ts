import type { GetLoadContextFunction } from '@react-router/cloudflare';

// biome-ignore lint/suspicious/noExplicitAny: params を使用しないため
type Cloudflare = EventContext<Env, any, Record<string, unknown>>;

declare module 'react-router' {
    interface AppLoadContext {
        cloudflare: Cloudflare;
    }
}

export const getLoadContext: GetLoadContextFunction<Env> = ({ context }) => {
    return { ...context };
};
