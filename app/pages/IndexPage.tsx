import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '~/components/ui/button';
import { useTranslation } from '~/i18n/useTranslation';

export const IndexPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const onClick = useCallback(() => {
        navigate('/login', { viewTransition: true });
    }, [navigate]);

    return (
        <>
            <h1 className="text-xl">言娘</h1>

            <Button type="button" className="my-3" onClick={onClick}>
                {t('login')}
            </Button>
        </>
    );
};
