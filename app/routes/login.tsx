import { data as dataFn } from 'react-router';

import { getLanguage } from '~/i18n/resolver.server';
import { tl } from '~/i18n/translations';
import { LoginPage } from '~/pages/LoginPage';

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

type ActionData =
    | Readonly<{ type: 'invalid_form_data' } | { type: 'failed' }>
    | undefined;

const data = (actionData: ActionData, init?: number | ResponseInit) =>
    dataFn(actionData, init);

const isValidRedirectUrl = ({
    url,
    baseUrl,
}: { url: string; baseUrl: string }) => {
    try {
        const urlObj = new URL(url, baseUrl);
        return url.startsWith('/') || urlObj.origin === baseUrl;
    } catch {
        return false;
    }
};

export const action = async ({ context, request }: Route.ActionArgs) => {
    const formData = await request.formData();

    return data({ type: 'invalid_form_data' }, { status: 400 });

    /*
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

    const baseUrl = context.cloudflare.env.BASE_URL;
    const url = new URL(request.url, baseUrl);
    const returnTo = url.searchParams.get('returnTo');

    let redirectUrl = '/';

    if (returnTo !== null) {
        const decodedUrl = decodeURIComponent(returnTo);

        if (isValidRedirectUrl({ url: decodedUrl, baseUrl })) {
            redirectUrl = decodedUrl;
        }
    }

    return redirect(redirectUrl, {
        headers: {
            'Set-Cookie': await commitLoginSession({
                context,
                userName: user.username,
            }),
        },
    });
    */
};

export default function Login(props: Route.ComponentProps) {
    const actionData = props.actionData as ActionData;

    return (
        <LoginPage
            type={actionData === undefined ? 'initial' : actionData.type}
        />
    );
}
