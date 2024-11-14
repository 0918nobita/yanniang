import { Hono } from 'hono';

import { requireAuth } from '../../middlewares';

const app = new Hono();

app.get('/', requireAuth, (c) => {
    const user = c.get('user');

    return c.render(
        <>
            <h1>学習ノート</h1>
            <p>{user.name} としてログインしています。</p>
        </>,
        { title: '学習ノート' },
    );
});

export default app;
