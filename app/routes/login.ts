import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { z } from 'zod';

import type { User } from '../user';

const app = new Hono<{ Bindings: CFWorkersEnv }>();

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
    '/',
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

export default app;
