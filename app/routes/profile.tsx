import { redirect, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

import { getSession } from '~/session';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'));

    if (!session.get('username')) {
        return redirect('/login');
    }

    const userId: string = session.get('username');
    return userId;
};

export default function Profile() {
    const userId = useLoaderData<typeof loader>();

    return <p>{userId}</p>;
}
