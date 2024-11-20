import { redirect, type LoaderFunctionArgs } from '@remix-run/cloudflare';

import { destroySession, getSession } from '~/session';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'));

    return redirect('/', {
        headers: { 'Set-Cookie': await destroySession(session) },
    });
};
