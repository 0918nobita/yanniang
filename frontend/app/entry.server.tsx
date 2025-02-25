import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { renderToReadableStream } from "react-dom/server";

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
    loadContext: AppLoadContext
) {
    const body = await renderToReadableStream(
        <ServerRouter context={routerContext} url={request.url} />,
        {
            signal: request.signal,
            onError(error: unknown) {
                console.error(error);
                responseStatusCode = 500;
            },
        }
    );

    responseHeaders.set("Content-Type", "text/html");
    return new Response(body, {
        headers: responseHeaders,
        status: responseStatusCode,
    });
}
