import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';

export const links: Route.LinksFunction = () => [
    {
        rel: 'icon',
        href: 'data:image/png;base64,iVBORw0KGgo=',
    },
];

export default function App(_: Route.ComponentProps) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
