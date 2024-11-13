import { createMiddleware } from 'hono/factory';

import type { HonoEnv } from '../env';
import type { User } from '../user';
import { extendSession } from './extendSession';
import { getSessionId } from './getSessionId';

export const requireAuth = createMiddleware<
    HonoEnv & { Variables: { user: User } }
>(async (c, next) => {
    const sessionId = getSessionId(c);

    if (sessionId === null) return c.json({ error: '認証が必要です' }, 401);

    const username = await c.env.SESSIONS.get(sessionId);

    if (username === null) return c.json({ error: '認証が必要です' }, 401);

    await extendSession(c, sessionId, username);

    c.set('user', { name: username });

    await next();
});
