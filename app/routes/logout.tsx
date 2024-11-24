import { redirect } from 'react-router';

import { destroyLoginSession } from '~/session.server';

import type { Route } from './+types/logout';

export const loader = async ({ context, request }: Route.LoaderArgs) => {
    return redirect('/', {
        headers: {
            'Set-Cookie': await destroyLoginSession({
                context,
                cookieHeader: request.headers.get('Cookie'),
            }),
        },
    });
};
