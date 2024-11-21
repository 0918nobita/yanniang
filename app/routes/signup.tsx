import { useCallback, useEffect, useRef } from 'react';
import { data as dataFn, Form } from 'react-router';
import { toast as toastFn } from 'sonner';
import { D1QB } from 'workers-qb';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

import type { Route } from './+types/signup';

const formDataSchema = z.string().length(10);

const recordSchema = z
    .object({
        code: z.string(),
        is_used: z.union([z.literal(0), z.literal(1)]),
    })
    .transform((v) => ({ code: v.code, isUsed: v.is_used === 1 }));

type InvitationCode = z.infer<typeof recordSchema>;

type ActionData = Readonly<
    | { type: 'invalid_form_data' }
    | { type: 'nonexistent_invitation_code' }
    | { type: 'unexpected_error' }
    | { type: 'redeemed_invitation_code' }
    | { type: 'success' }
>;

const data = (actionData: ActionData, init?: number | ResponseInit) =>
    dataFn(actionData, init);

export const action = async ({ context, request }: Route.ActionArgs) => {
    const formData = await request.formData();

    const formValidationResult = formDataSchema.safeParse(
        formData.get('invitation_code'),
    );

    if (!formValidationResult.success) {
        return data({ type: 'invalid_form_data' }, { status: 401 });
    }

    const code = formValidationResult.data;

    const qb = new D1QB(context.cloudflare.env.DB);
    const queryResult = await qb
        .select<InvitationCode>('invitation_codes')
        .where('code = ?', code)
        .one();

    if (queryResult.results === undefined) {
        return data({ type: 'nonexistent_invitation_code' }, { status: 401 });
    }

    const recordValidationResult = recordSchema.safeParse(queryResult.results);

    if (!recordValidationResult.success) {
        return data({ type: 'unexpected_error' }, { status: 500 });
    }

    const record = recordValidationResult.data;

    if (record.isUsed) {
        return data({ type: 'redeemed_invitation_code' }, { status: 401 });
    }

    return data({ type: 'success' as const });
};

export const meta: Route.MetaFunction = () => [{ title: '注册' }];

export default function SignUp({ actionData }: Route.ComponentProps) {
    const toastIds = useRef<Array<string | number>>([]);

    const singleToast = useCallback(
        (type: 'success' | 'warning' | 'error', message: string) => {
            for (const toastId of toastIds.current) {
                toastFn.dismiss(toastId);
            }

            const toastOptions = {
                closeButton: true,
                duration: Number.POSITIVE_INFINITY,
            };

            const toastId =
                type === 'success'
                    ? toastFn.success(message, toastOptions)
                    : type === 'warning'
                      ? toastFn.warning(message, toastOptions)
                      : toastFn.error(message, toastOptions);

            toastIds.current = [toastId];
        },
        [],
    );

    useEffect(() => {
        if (actionData === undefined) return;

        if (actionData.type === 'success') {
            singleToast(
                'success',
                '有効な招待コードです。続けてユーザー名・パスワードを設定してください。',
            );
            return;
        }

        if (actionData.type === 'invalid_form_data') {
            singleToast(
                'warning',
                '入力形式が正しくありません。入力ミスがないか、再度確認してください。',
            );
            return;
        }

        if (actionData.type === 'nonexistent_invitation_code') {
            singleToast(
                'error',
                '無効な招待コードです。入力ミスがないか、再度確認してください。',
            );
            return;
        }

        if (actionData.type === 'redeemed_invitation_code') {
            singleToast(
                'error',
                '既に使われて失効した招待コードです。他の有効な招待コードを入力してください。',
            );
            return;
        }

        singleToast(
            'error',
            '予期しないエラーが発生しました。開発者に報告していただけると助かります。',
        );
    }, [actionData, singleToast]);

    return (
        <>
            <h1 className="text-xl">注册</h1>

            <p>招待コードが必要です</p>

            <Form method="post">
                <Input
                    className="my-3"
                    name="invitation_code"
                    placeholder="招待コード"
                />
                <Button type="submit">送信する</Button>
            </Form>
        </>
    );
}
