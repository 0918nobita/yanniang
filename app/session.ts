import { createCookieSessionStorage } from '@remix-run/cloudflare';

const { getSession, commitSession, destroySession } =
    createCookieSessionStorage({
        cookie: {
            name: '__session',
            domain: process.env.DOMAIN,
            httpOnly: true,
            maxAge: 3600,
            path: '/',
            sameSite: 'lax',
            secure: true,
        },
    });

export { getSession, commitSession, destroySession };
