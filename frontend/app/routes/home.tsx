import type { Route } from './+types/home';

export const meta: Route.MetaFunction = () => [
    {
        title: '言娘',
    },
];

export function loader(_: Route.LoaderArgs) {
    return {};
}

export default function Home(_: Route.ComponentProps) {
    return (
        <>
            <h1>言娘</h1>
            <p>{import.meta.env.VITE_BACKEND_ORIGIN}</p>
        </>
    );
}
