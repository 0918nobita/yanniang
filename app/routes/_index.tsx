import type { MetaFunction } from '@remix-run/cloudflare';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';

export const meta: MetaFunction = () => [{ title: '言娘' }];

export default function Index() {
    const onClick = useCallback(() => {
        toast('トーストを表示するテスト');
    }, []);

    return (
        <>
            <h2 className="text-gray-600">Hello, Remix!</h2>
            <Button size="sm" onClick={onClick}>
                ログイン
            </Button>
        </>
    );
}
