import type React from 'react';
import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from 'react-router';

import type { Route } from './+types/root';

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function Root() {
    return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    if (isRouteErrorResponse(error)) {
        return (
            <>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
            </>
        );
    }

    return error instanceof Error ? (
        <>
            <h1>Error</h1>
            <p>{error.message}</p>
            <h2>Stacktrace:</h2>
            <pre>{error.stack}</pre>
        </>
    ) : (
        <h1>Unknown error</h1>
    );
}
