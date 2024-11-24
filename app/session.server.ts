import {
    type AppLoadContext,
    type Cookie,
    createCookie as innerCreateCookie,
} from 'react-router';
import { z } from 'zod';

const createCookie = (context: AppLoadContext) =>
    innerCreateCookie('__session', {
        httpOnly: true,
        maxAge: 3600,
        path: '/',
        sameSite: 'lax',
        secure: true,
        domain: context.cloudflare.env.DOMAIN,
        secrets: [context.cloudflare.env.COOKIE_SECRET],
    });

const cookieValueSchema = z.string().uuid();

export const { getUser, commitLoginSession, destroyLoginSession } = (() => {
    let cookie: Cookie | null = null;

    return {
        getUser: async ({
            context,
            cookieHeader,
        }: { context: AppLoadContext; cookieHeader: string | null }) => {
            if (cookie === null) {
                cookie = createCookie(context);
            }

            const rawCookieValue = await cookie.parse(cookieHeader);

            const validationResult =
                cookieValueSchema.safeParse(rawCookieValue);

            if (!validationResult.success) {
                return null;
            }

            const sessionId = validationResult.data;

            const kvRawValue =
                await context.cloudflare.env.SESSIONS.get(sessionId);

            if (kvRawValue === null) {
                return null;
            }

            let parsedValue: unknown;

            try {
                parsedValue = JSON.parse(kvRawValue);
            } catch {
                await context.cloudflare.env.SESSIONS.delete(sessionId);
                return null;
            }

            const user = z
                .object({ userName: z.string() })
                .safeParse(parsedValue);

            return user.success ? user.data : null;
        },

        commitLoginSession: async ({
            context,
            userName,
        }: { context: AppLoadContext; userName: string }) => {
            if (cookie === null) {
                cookie = createCookie(context);
            }

            const sessionId = crypto.randomUUID();

            await context.cloudflare.env.SESSIONS.put(
                sessionId,
                JSON.stringify({
                    userName,
                }),
            );

            return await cookie.serialize(sessionId);
        },

        destroyLoginSession: async ({
            context,
            cookieHeader,
        }: { context: AppLoadContext; cookieHeader: string | null }) => {
            if (cookie === null) {
                cookie = createCookie(context);
            }

            const rawCookieValue = await cookie.parse(cookieHeader);

            const validationResult =
                cookieValueSchema.safeParse(rawCookieValue);

            if (validationResult.success) {
                const sessionId = validationResult.data;

                await context.cloudflare.env.SESSIONS.delete(sessionId);
            }

            return await cookie.serialize('', { maxAge: 1 });
        },
    };
})();
