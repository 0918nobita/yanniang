import { useEffect } from 'react';
import { redirect } from 'react-router';

import { getUser } from '~/session.server';

import type { Route } from './+types/note.$noteId';

type Note = Readonly<{
    id: string;
    ja: string;
    zh_cn: string;
    author_id: string;
    created_at: Date;
    is_deleted: number;
}>;

export const loader = async ({
    context,
    params,
    request,
}: Route.LoaderArgs) => {
    const user = await getUser({
        context,
        cookieHeader: request.headers.get('Cookie'),
    });

    if (user === null) {
        return redirect(
            `/login?returnTo=${encodeURIComponent(`/note/${params.noteId}`)}`,
        );
    }

    /*
    const db = new D1QB(context.cloudflare.env.DB);

    const result = await db
        .select<Note>('notes')
        .where('id = ?', params.noteId)
        .one();

    if (result.results === undefined) {
        throw new Response(null, { status: 404, statusText: 'Not Found' });
    }

    return result.results;
    */

    return {
        id: 'xxx',
        ja: '账号',
        zh_cn: 'アカウント',
        author_id: 'yyy',
        created_at: new Date(),
        is_deleted: 0,
    };
};

export default function NotePage(props: Route.ComponentProps) {
    const loaderData = props.loaderData as Note;

    useEffect(() => {
        console.log(loaderData);
    }, [loaderData]);

    return (
        <>
            <h1 className="text-xl">ノート</h1>
            <p>単語またはスキット</p>
            <p>日本語：{loaderData.ja}</p>
            <p>汉语：{loaderData.zh_cn}</p>
        </>
    );
}
