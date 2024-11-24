import { data as dataFn } from 'react-router';
import { D1QB } from 'workers-qb';
import { z } from 'zod';

import { getLanguage } from '~/i18n/resolver.server';
import { tl } from '~/i18n/translations';
import { SignUpPage } from '~/pages/SignUpPage';

import type { Route } from './+types/signup';

export const loader = async ({ request }: Route.LoaderArgs) => {
    return { language: await getLanguage(request) };
};

export const meta = ({ data }: Route.MetaArgs) => [
    { title: tl(data.language, 'signUp') },
];

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

    return data({ type: 'success' });
};

export default function SignUp({ actionData }: Route.ComponentProps) {
    return (
        <SignUpPage
            type={actionData === undefined ? 'initial' : actionData.type}
        />
    );
}
