import type { Context } from 'hono';
import { getCookie } from 'hono/cookie';

export const getSessionId = (c: Context): string | null => {
    const sessionId = getCookie(c, 'session');

    if (sessionId === undefined || sessionId === '') return null;

    return sessionId;
};
