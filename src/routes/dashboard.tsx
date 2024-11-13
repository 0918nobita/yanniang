import { Hono } from 'hono';

import type { HonoEnv } from '../env';
import { withAuthStatus } from '../middlewares';
import type { User } from '../user';

const app = new Hono<HonoEnv & { Variables: { user: User | null } }>();

app.get('/', withAuthStatus, (c) => {
    const user = c.get('user');

    return c.html(
        <html lang="ja">
            <body>
                {user === null ? (
                    <p>未ログイン</p>
                ) : (
                    <p>{user.name} としてログインしています</p>
                )}
            </body>
        </html>,
    );
});

export default app;
