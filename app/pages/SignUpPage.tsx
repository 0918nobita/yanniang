import { useEffect } from 'react';
import { Form } from 'react-router';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useTranslation } from '~/i18n/useTranslation';
import { useSingleToast } from '~/toast';

type PageProps = Readonly<
    | { type: 'initial' }
    | { type: 'unexpected_error' }
    | { type: 'invalid_form_data' }
    | { type: 'nonexistent_invitation_code' }
    | { type: 'redeemed_invitation_code' }
    | { type: 'success' }
>;

export const SignUpPage: React.FC<PageProps> = (props) => {
    const { t } = useTranslation();
    const singleToast = useSingleToast();

    useEffect(() => {
        switch (props.type) {
            case 'initial':
                return;

            case 'unexpected_error':
                singleToast(
                    'error',
                    '予期しないエラーが発生しました。開発者に報告していただけると助かります。',
                );
                return;

            case 'invalid_form_data':
                singleToast(
                    'warning',
                    '入力形式が正しくありません。入力ミスがないか、再度確認してください。',
                );
                return;

            case 'nonexistent_invitation_code':
                singleToast(
                    'error',
                    '無効な招待コードです。入力ミスがないか、再度確認してください。',
                );
                return;

            case 'redeemed_invitation_code':
                singleToast(
                    'error',
                    '既に使われて失効した招待コードです。他の有効な招待コードを入力してください。',
                );
                return;

            case 'success':
                singleToast(
                    'success',
                    '有効な招待コードです。続けてユーザー名・パスワードを設定してください。',
                );
                return;
        }
    }, [props.type, singleToast]);

    return (
        <>
            <h1 className="text-xl">{t('signUp')}</h1>

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
};
