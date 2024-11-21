import { Form, data, useNavigate } from 'react-router';
import * as bcrypt from 'bcrypt-ts';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { D1QB } from 'workers-qb';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { getSession, commitSession } from '~/session';

import type { Route } from './+types/login';

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

export const meta: Route.MetaFunction = () => [{ title: '登录' }];

export default function Login({ actionData }: Route.ComponentProps) {
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
            <h1 className="text-xl">登录</h1>

            <Form method="post">
                <Label>用户名</Label>
                <Input className="my-3" name="username" placeholder="用户名" />

                <Label>密码</Label>
                <Input
                    className="my-3"
                    type="password"
                    name="password"
                    placeholder="密码"
                />

                <Button type="submit">登录</Button>
            </Form>
        </>
    );
}
