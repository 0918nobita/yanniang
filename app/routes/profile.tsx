import { redirect } from 'react-router';

import { getSession } from '~/session';

import type { Route } from './+types/profile';

export const loader = async ({ request }: Route.LoaderArgs) => {
    const session = await getSession(request.headers.get('Cookie'));

    if (!session.get('username')) {
        return redirect('/login');
    }

    const userId: string = session.get('username');
    return userId;
};

export default function Profile({ loaderData }: Route.ComponentProps) {
    const userId = loaderData as string;

    return <p>{userId}</p>;
}
