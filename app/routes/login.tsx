import {
    type ActionFunctionArgs,
    type MetaFunction,
    data,
} from '@remix-run/cloudflare';
import { Form, useActionData, useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { getSession, commitSession } from '~/session';

const formSchema = z.object({
    username: z.string().min(6),
    password: z.string().min(8),
});

export const action = async ({ request }: ActionFunctionArgs) => {
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

    if (
        validatedFormData.username !== 'username' ||
        validatedFormData.password !== 'password'
    ) {
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

export const meta: MetaFunction = () => [{ title: '登录' }];

export default function Login() {
    const navigate = useNavigate();

    const actionData = useActionData<typeof action>();

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
            <h1>登录</h1>

            <Form method="post">
                <Label>用户名</Label>
                <Input name="username" placeholder="用户名" />

                <Label>密码</Label>
                <Input type="password" name="password" placeholder="密码" />

                <Button type="submit">登录</Button>
            </Form>
        </>
    );
}
