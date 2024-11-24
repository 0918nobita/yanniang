import { redirect } from 'react-router';

import { getUser } from '~/session.server';

import type { Route } from './+types/profile';

export const loader = async ({ context, request }: Route.LoaderArgs) => {
    const user = await getUser({
        context,
        cookieHeader: request.headers.get('Cookie'),
    });

    if (user === null) {
        return redirect(`/login?returnTo=${encodeURIComponent('/profile')}`);
    }

    return user.userName;
};

export default function Profile({ loaderData }: Route.ComponentProps) {
    const userId = loaderData as string;

    return <p>{userId}</p>;
}
