import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '~/components/ui/button';
import { useTranslation } from '~/i18n/useTranslation';

import type { Route } from './+types/_index';

export const meta = (_: Route.MetaArgs) => [{ title: '言娘' }];

export default function Index(_: Route.ComponentProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const onClick = useCallback(() => {
        navigate('/login', { viewTransition: true });
    }, [navigate]);

    return (
        <>
            <h2 className="text-gray-600">Hello, Remix!</h2>
            <Button size="sm" onClick={onClick} className="my-3">
                {t('login')}
            </Button>
        </>
    );
}
