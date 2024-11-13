import { createMiddleware } from 'hono/factory';

import type { HonoEnv } from '../env';
import type { User } from '../user';
import { extendSession } from './extendSession';
import { getSessionId } from './getSessionId';

export const withAuthStatus = createMiddleware<
    HonoEnv & { Variables: { user: User | null } }
>(async (c, next) => {
    const sessionId = getSessionId(c);

    if (sessionId === null) {
        c.set('user', null);
        return await next();
    }

    const username = await c.env.SESSIONS.get(sessionId);

    if (username === null) {
        c.set('user', null);
        return await next();
    }

    await extendSession(c, sessionId, username);

    c.set('user', { name: username });

    await next();
});
