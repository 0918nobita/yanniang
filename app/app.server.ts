import { createRequestHandler } from '@react-router/express';
import express from 'express';
import type { AppLoadContext } from 'react-router';

declare module 'react-router' {
    interface AppLoadContext {
        message: string;
    }
}

export const app = express();

app.use(
    createRequestHandler({
        // @ts-ignore
        build: () => import('virtual:react-router/server-build'),
        getLoadContext: (): AppLoadContext => ({
            message: 'Hello, React Router!',
        }),
    }),
);
