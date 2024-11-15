import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => [{ title: '言娘' }];

export default function Index() {
    return <h2 className="text-gray-600">Hello, Remix!</h2>;
}
