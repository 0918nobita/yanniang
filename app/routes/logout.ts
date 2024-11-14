import { Hono } from 'hono';
import { deleteCookie, getCookie } from 'hono/cookie';

const app = new Hono<{ Bindings: CFWorkersEnv }>();

app.post('/', async (c) => {
    const sessionId = getCookie(c, 'session');

    if (sessionId !== undefined) {
        await c.env.SESSIONS.delete(sessionId);
    }

    deleteCookie(c, 'session');

    return c.json({ message: 'ログアウトしました' });
});

export default app;
