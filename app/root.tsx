import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
} from 'react-router';

import { Toaster } from '~/components/ui/sonner';
import { RootLayout } from '~/components/RootLayout';
import { LangCode } from '~/domain/valueObjects';
import { I18nProvider } from '~/i18n/context';
import { getLanguage } from '~/i18n/resolver.server';
import tailwind from '~/tailwind.css?url';

import type { Route } from './+types/root';

export const loader = async ({ request }: Route.LoaderArgs) => {
    const language = await getLanguage(request);
    return { language };
};

export const links: Route.LinksFunction = () => [
    { rel: 'stylesheet', href: tailwind },
];

function Document({
    children,
    language,
}: { children: React.ReactNode; language: LangCode }) {
    return (
        <html lang={language} suppressHydrationWarning>
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
                <I18nProvider language={language}>
                    <RootLayout>{children}</RootLayout>
                    <Toaster position="bottom-left" />
                </I18nProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App({ loaderData }: Route.ComponentProps) {
    return (
        <Document language={loaderData.language}>
            <Outlet />
        </Document>
    );
}

export function ErrorBoundary({ error, loaderData }: Route.ErrorBoundaryProps) {
    const language =
        loaderData === undefined ? LangCode.ja : loaderData.language;

    if (isRouteErrorResponse(error)) {
        return (
            <Document language={language}>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
            </Document>
        );
    }

    return (
        <Document language={language}>
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
