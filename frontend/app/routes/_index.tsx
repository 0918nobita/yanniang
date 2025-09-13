import type { Route } from './+types/_index';

export const meta: Route.MetaFunction = () => [{ title: '言娘' }];

export const loader = (_: Route.LoaderArgs) => {
    return {};
};

export default function Index(_: Route.ComponentProps) {
    return <p>Hello, world!</p>;
}
