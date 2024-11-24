import * as bcrypt from 'bcrypt-ts';
import { data as dataFn } from 'react-router';
import { D1QB } from 'workers-qb';
import { z } from 'zod';

import { getLanguage } from '~/i18n/resolver.server';
import { tl } from '~/i18n/translations';
import { LoginPage } from '~/pages/LoginPage';
import { getSession, commitSession } from '~/session';

import type { Route } from './+types/login';

export const loader = async ({ request }: Route.LoaderArgs) => {
    return { language: await getLanguage(request) };
};

export const meta = ({ data }: Route.MetaArgs) => [
    { title: tl(data.language, 'login') },
];

type User = Readonly<{
    username: string;
    password: string;
}>;

const formSchema = z.object({
    username: z.string().min(6),
    password: z.string().min(8),
});

type ActionData = Readonly<
    | { type: 'initial' }
    | { type: 'invalid_form_data' }
    | { type: 'success' }
    | { type: 'failed' }
>;

const data = (actionData: ActionData, init?: number | ResponseInit) =>
    dataFn(actionData, init);

export const action = async ({ context, request }: Route.ActionArgs) => {
    const formData = await request.formData();

    const validationResult = formSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    });

    if (!validationResult.success) {
        return data({ type: 'invalid_form_data' }, { status: 400 });
    }

    const validatedFormData = validationResult.data;

    const qb = new D1QB(context.cloudflare.env.DB);

    const { results: user } = await qb
        .select<User>('users')
        .where('username = ?', validatedFormData.username)
        .one();

    if (user === undefined) {
        return data({ type: 'failed' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(
        validatedFormData.password,
        user.password,
    );

    if (!isPasswordValid) {
        return data({ type: 'failed' }, { status: 401 });
    }

    const session = await getSession(request.headers.get('Cookie'));

    session.set('username', validatedFormData.username);

    const headers = { 'Set-Cookie': await commitSession(session) };

    return data({ type: 'success' as const }, { headers });
};

export default function Login({ actionData }: Route.ComponentProps) {
    return (
        <LoginPage
            type={actionData === undefined ? 'initial' : actionData.type}
        />
    );
}
