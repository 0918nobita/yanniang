import { Hono } from 'hono';
import { withAuthStatus } from '../middlewares';

const app = new Hono();

app.get('/', withAuthStatus, (c) => {
    const user = c.get('user');

    return c.render(
        <>
            <h1>言娘</h1>
            <p>
                <a href="/study_note">学習ノート</a>
            </p>
            {user === null ? (
                <p>未ログイン</p>
            ) : (
                <p>{user.name} としてログインしています</p>
            )}
        </>,
        { title: '言娘' },
    );
});

export default app;
