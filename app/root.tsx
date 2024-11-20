import type { LinksFunction } from '@remix-run/cloudflare';
import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
} from '@remix-run/react';

import { Toaster } from '~/components/ui/sonner';
import { RootLayout } from '~/components/RootLayout';
import tailwind from '~/tailwind.css?url';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: tailwind },
];

function Document({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <RootLayout>{children}</RootLayout>
                <Toaster position="bottom-left" />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <Document>
            <Outlet />
        </Document>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <Document>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
            </Document>
        );
    }

    return (
        <Document>
            {error instanceof Error ? (
                <>
                    <h1>Error</h1>
                    <p>{error.message}</p>
                    <p>Stack trace:</p>
                    <pre>{error.stack}</pre>
                </>
            ) : (
                <h1>Unknown error</h1>
            )}
        </Document>
    );
}
