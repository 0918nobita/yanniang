import { Form, data, useNavigate } from 'react-router';
import * as bcrypt from 'bcrypt-ts';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { D1QB } from 'workers-qb';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { getLanguage } from '~/i18n/resolver.server';
import { tl } from '~/i18n/translations';
import { useTranslation } from '~/i18n/useTranslation';
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

export const action = async ({ context, request }: Route.ActionArgs) => {
    const formData = await request.formData();

    const validationResult = formSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    });

    if (!validationResult.success) {
        return data(
            { type: 'error' as const, message: 'フォームデータが不正です' },
            { status: 400 },
        );
    }

    const validatedFormData = validationResult.data;

    const qb = new D1QB(context.cloudflare.env.DB);

    const { results: user } = await qb
        .select<User>('users')
        .where('username = ?', validatedFormData.username)
        .one();

    if (user === undefined) {
        return data(
            { type: 'error' as const, message: '認証に失敗しました' },
            { status: 401 },
        );
    }

    const isPasswordValid = await bcrypt.compare(
        validatedFormData.password,
        user.password,
    );

    if (!isPasswordValid) {
        return data(
            { type: 'error' as const, message: '認証に失敗しました' },
            { status: 401 },
        );
    }

    const session = await getSession(request.headers.get('Cookie'));

    session.set('username', validatedFormData.username);

    const headers = { 'Set-Cookie': await commitSession(session) };

    return data({ type: 'success' as const }, { headers });
};

export default function Login({ actionData }: Route.ComponentProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        if (actionData === undefined) return;

        if (actionData.type === 'success') {
            toast.success('ログインに成功しました');
            navigate('/', { viewTransition: true });
            return;
        }

        toast.error('ログインに失敗しました');
    }, [actionData, navigate]);

    return (
        <>
            <h1 className="text-xl">{t('login')}</h1>

            <Form method="post">
                <Label>{t('userName')}</Label>
                <Input
                    className="my-3"
                    name="username"
                    placeholder={t('userName')}
                />

                <Label>{t('password')}</Label>
                <Input
                    className="my-3"
                    type="password"
                    name="password"
                    placeholder={t('password')}
                />

                <Button type="submit">{t('login')}</Button>
            </Form>
        </>
    );
}
