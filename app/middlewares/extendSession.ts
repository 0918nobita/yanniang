import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';

import type { User } from '../user';

export const extendSession = async (
    c:
        | Context<{ Bindings: CFWorkersEnv; Variables: { user: User | null } }>
        | Context<{ Bindings: CFWorkersEnv; Variables: { user: User } }>,
    sessionId: string,
    username: string,
) => {
    await c.env.SESSIONS.put(sessionId, username, {
        expirationTtl: 60 * 60 * 24, // 24 hours
    });

    setCookie(c, 'session', sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        maxAge: 60 * 60 * 24, // 24 hours
    });
};
