import type { Route } from './+types/login';

export const meta: Route.MetaFunction = () => [{ title: 'ログイン | 言娘' }];

export const loader = async (_: Route.LoaderArgs) => {
    const res = await fetch('http://localhost:3001/health');
    if (res.status !== 200) {
        throw new Error('API server is not running');
    }
    const healthData = await res.json();

    return { healthData };
};

export default function Login({ loaderData }: Route.ComponentProps) {
    const { healthData } = loaderData;
    return (
        <>
            <p>Login</p>
            <pre>
                <code>{JSON.stringify(healthData, null, 2)}</code>
            </pre>
        </>
    );
}
