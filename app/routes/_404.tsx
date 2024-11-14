import type { NotFoundHandler } from 'hono';

const handler: NotFoundHandler = (c) => {
    return c.render(<h1>Sorry, Not Found...</h1>, { title: '404 Not Found' });
};

export default handler;
