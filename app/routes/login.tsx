import { useActionState } from 'react';
import { toast } from 'sonner';

import type { Route } from './+types/login';
import { LoginButton } from '~/components/LoginButton';

export function meta(_: Route.MetaArgs) {
    return [{ title: '言娘 账号登录' }];
}

export default function Login(_: Route.ComponentProps) {
    const [, onSubmit, isPending] = useActionState<null, FormData>(
        (_prevState, formData) =>
            new Promise(() => {
                toast.success('登录成功！');
                console.log(formData);
            }),
        null,
    );

    return (
        <div className="grid place-items-center min-h-screen p-4">
            <main className="flex flex-col items-center w-[400px] px-4 py-4 rounded-md bg-white dark:bg-gray-700">
                <h2 className="mb-4 text-xl">言娘 账号登录</h2>
                <form action={onSubmit} className="w-full flex flex-col">
                    <label htmlFor="username" className="mb-4">
                        用户名
                    </label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="请输入用户名"
                        disabled={isPending}
                        className="px-2 py-1 mb-4 dark:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-500 disabled:cursor-not-allowed"
                    />
                    <label htmlFor="password" className="mb-4">
                        密码
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="请输入密码"
                        disabled={isPending}
                        className="px-2 py-1 mb-8 dark:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-500 disabled:cursor-not-allowed"
                    />
                    <LoginButton disabled={isPending} />
                </form>
            </main>
        </div>
    );
}
