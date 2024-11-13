import { Hono } from 'hono';

import type { HonoEnv } from './env';
import { dashboard, login, logout, settings } from './routes';

const app = new Hono<HonoEnv>();

app.route('/', dashboard);
app.route('/login', login);
app.route('/logout', logout);
app.route('/settings', settings);

export default app;
