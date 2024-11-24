import { useEffect } from 'react';
import { Form, useNavigate } from 'react-router';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useTranslation } from '~/i18n/useTranslation';
import { useSingleToast } from '~/toast';

type PageProps = Readonly<
    | { type: 'initial' }
    | { type: 'invalid_form_data' }
    | { type: 'success' }
    | { type: 'failed' }
>;

export const LoginPage: React.FC<PageProps> = (props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const singleToast = useSingleToast();

    useEffect(() => {
        switch (props.type) {
            case 'initial':
                return;
            case 'invalid_form_data':
                singleToast('warning', '入力形式が正しくありません');
                return;
            case 'failed':
                singleToast('error', '認証に失敗しました');
                return;
            case 'success':
                singleToast('success', 'ログインに成功しました');
                navigate('/', { viewTransition: true });
                return;
        }
    }, [navigate, props.type, singleToast]);

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
};
