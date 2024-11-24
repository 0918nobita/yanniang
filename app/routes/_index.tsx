import { IndexPage } from '~/pages/IndexPage';

import type { Route } from './+types/_index';

export const loader = async ({ context }: Route.LoaderArgs) => {
    console.log(await context.sql`SELECT * FROM users`);
    return {};
};

export const meta = (_: Route.MetaArgs) => [{ title: '言娘' }];

export default function Index(_: Route.ComponentProps) {
    return <IndexPage />;
}
