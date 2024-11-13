import { Hono } from 'hono';

import type { HonoEnv } from '../env';
import { requireAuth } from '../middlewares';
import type { User } from '../user';

const app = new Hono<HonoEnv & { Variables: { user: User } }>();

app.get('/', requireAuth, (c) => {
    const user = c.get('user');

    return c.html(
        <html lang="ja">
            <body>
                <h2>設定</h2>
                <p>{user.name}</p>
            </body>
        </html>,
    );
});

export default app;
