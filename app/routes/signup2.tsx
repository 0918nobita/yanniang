import { Form } from 'react-router';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { getLanguage } from '~/i18n/resolver.server';
import { tl } from '~/i18n/translations';
import { useTranslation } from '~/i18n/useTranslation';

import type { Route } from './+types/signup2';

export const loader = async ({ request }: Route.LoaderArgs) => {
    const language = await getLanguage(request);
    return { language };
};

export const meta: Route.MetaFunction = ({ data }) => [
    { title: tl(data.language, 'signUp') },
];

export const action = async (_: Route.ActionArgs) => {
    return {};
};

export default function SignUp2(_: Route.ComponentProps) {
    const { t } = useTranslation();

    return (
        <>
            <h1 className="text-xl">{t('signUp')}</h1>

            <Form method="post">
                <Label>ユーザーID</Label>
                <Input
                    name="userName"
                    placeholder={t('userName')}
                    className="my-3"
                />
                <Label>パスワード</Label>
                <Input
                    name="password1"
                    type="password"
                    placeholder={t('password')}
                    className="my-3"
                />
                <Label>パスワード (再度入力してください)</Label>
                <Input
                    name="password2"
                    type="password"
                    placeholder={t('password')}
                    className="my-3"
                />
                <Button type="submit">{t('signUp')}</Button>
            </Form>
        </>
    );
}
