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

import { zValidator } from '@hono/zod-validator';
import { Hono, type Context, type MiddlewareHandler } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { z } from 'zod';

type User = Readonly<{
    name: string;
}>;

const app = new Hono<{
    Bindings: Env;
    Variables: { user: User };
}>();

app.get('/', (c) => {
    const userId = null as string | null;

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

const authenticateUser = async (
    username: string,
    password: string,
): Promise<User | null> => {
    if (username === 'username' && password === 'password') {
        return { name: 'username' };
    }

    return null;
};

app.post(
    '/login',
    zValidator(
        'json',
        z.object({ username: z.string(), password: z.string() }),
    ),
    async (c) => {
        const { username, password } = c.req.valid('json');
        const user = await authenticateUser(username, password);
        if (user === null) {
            return c.json({ error: '認証に失敗しました' }, 401);
        }

        const sessionId = crypto.randomUUID();

        await c.env.SESSIONS.put(sessionId, username, {
            expirationTtl: 60 * 60 * 24, // 24 hours
        });

        setCookie(c, 'session', sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return c.json({ message: 'ログイン成功' });
    },
);

const getSessionUser = async (
    c: Context<{
        Bindings: { SESSIONS: KVNamespace };
        Variables: { user: User };
    }>,
): Promise<User | null> => {
    const sessionId = getCookie(c, 'session');
    if (sessionId === undefined || sessionId === '') return null;

    const username = await c.env.SESSIONS.get(sessionId);
    return username === null ? null : { name: username };
};

const authMiddleware: MiddlewareHandler<{
    Bindings: { SESSIONS: KVNamespace };
    Variables: { user: User };
}> = async (c, next) => {
    const user = await getSessionUser(c);

    if (user === null) {
        return c.json({ error: '認証が必要です' }, 401);
    }

    c.set('user', user);

    await next();
};

app.get('/mypage', authMiddleware, (c) => {
    const user = c.get('user');

    return c.html(
        <html lang="ja">
            <body>
                <p>{user.name} さんのマイページ</p>
            </body>
        </html>,
    );
});

app.post('/logout', async (c) => {
    const sessionId = getCookie(c, 'session');

    if (sessionId !== undefined) {
        await c.env.SESSIONS.delete(sessionId);
    }

    deleteCookie(c, 'session');

    return c.json({ message: 'ログアウトしました' });
});

export default app;
