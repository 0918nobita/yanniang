/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono';
import { CookieStore, type Session, sessionMiddleware } from 'hono-sessions';
import { prettyJSON } from 'hono/pretty-json';

type SessionDataTypes = {
    userId: string;
};

const app = new Hono<{
    Variables: { session: Session<SessionDataTypes> };
    Bindings: Env;
}>();

const store = new CookieStore();

app.use('*', async (c, next) =>
    sessionMiddleware({
        store,
        encryptionKey: c.env.SESSION_ENCRYPTION_KEY,
        expireAfterSeconds: 900,
        cookieOptions: {
            sameSite: 'Lax',
            path: '/',
            httpOnly: true,
        },
    })(c, next),
);

app.use(prettyJSON());

app.get('/', (c) => {
    console.log(`secret: ${c.env.SESSION_ENCRYPTION_KEY}`);
    console.log(`cookie: ${JSON.stringify(c.get('session'))}`);

    const session = c.get('session');
    const userId = session.get('userId');

    return c.html(
        <html lang="ja">
            <body>
                {userId === null ? (
                    <p>
                        <a href="/login">Login</a>
                    </p>
                ) : (
                    <>
                        <p>User ID: {userId}</p>
                        <p>
                            <a href="/logout">Logout</a>
                        </p>
                    </>
                )}
            </body>
        </html>,
    );
});

app.get('/login', (c) => {
    const session = c.get('session');

    session.set('userId', '0918nobita');

    return c.redirect('/');
});

app.get('logout', (c) => {
    c.get('session').deleteSession();

    return c.redirect('/');
});

export default app;
