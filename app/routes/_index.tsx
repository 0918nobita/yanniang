import type { MetaFunction } from '@remix-run/cloudflare';
import { useNavigate } from '@remix-run/react';
import { useCallback } from 'react';

import { Button } from '~/components/ui/button';

export const meta: MetaFunction = () => [{ title: '言娘' }];

export default function Index() {
    const navigate = useNavigate();

    const onClick = useCallback(() => {
        navigate('/login', { viewTransition: true });
    }, [navigate]);

    return (
        <>
            <h2 className="text-gray-600">Hello, Remix!</h2>
            <Button size="sm" onClick={onClick}>
                ログイン
            </Button>
        </>
    );
}
