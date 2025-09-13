import type { Route } from './+types/login';

export const meta: Route.MetaFunction = () => [{ title: 'ログイン | 言娘' }];

export const loader = (_: Route.LoaderArgs) => {
    return {};
};

export default function Login(_: Route.ComponentProps) {
    return <p>Login</p>;
}
