import { type NeonQueryFunction, neon } from '@neondatabase/serverless';
import type { AppLoadContext } from 'react-router';
import Rollbar from 'rollbar';
import type { PlatformProxy } from 'wrangler';

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module 'react-router' {
    interface AppLoadContext {
        cloudflare: Cloudflare;
        logger: Rollbar;
        sql: NeonQueryFunction<false, false>;
    }
}

type GetLoadContext = (args: {
    request: Request;
    context: { cloudflare: Cloudflare };
}) => AppLoadContext;

export const getLoadContext: GetLoadContext = ({ context }) => {
    const rollbar = new Rollbar({
        accessToken: context.cloudflare.env.ROLLBAR_ACCESS_TOKEN,
        captureUncaught: true,
        captureUnhandledRejections: true,
    });

    const sql = neon(context.cloudflare.env.DATABASE_URL);

    return {
        ...context,
        logger: rollbar,
        sql,
    };
};
