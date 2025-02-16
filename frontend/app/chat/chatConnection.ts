import {
    Console,
    Effect,
    Exit,
    Fiber,
    Option,
    PubSub,
    Queue,
    Schedule,
    Schema,
} from "effect";
import { ReceivedMessage, SendMessage } from "./types";

const createMessageSender = (
    messagesToSend: Queue.Dequeue<SendMessage>,
    ws: WebSocket
) =>
    Effect.forever(
        Effect.gen(function* () {
            const msg = yield* Queue.take(messagesToSend);
            yield* Console.log("Sending message:", msg);
            ws.send(JSON.stringify(msg));
        })
    );

const handleWebSocketMessage = (
    event: MessageEvent,
    receivedMessages: PubSub.PubSub<ReceivedMessage>
) => {
    const msg = Schema.decodeUnknownOption(Schema.parseJson(ReceivedMessage))(
        event.data
    );

    if (Option.isSome(msg)) {
        return Effect.runSync(PubSub.publish(receivedMessages, msg.value));
    }

    console.error("Failed to parse message", event.data);
};

const WS_CONNECTION_TIMEOUT = 10000;

class FailedToConnectWs extends Error {
    readonly _tag = "FailedToConnectWs";

    static {
        this.prototype.name = "FailedToConnectWs";
    }
}

class WsDisconnected extends Error {
    readonly _tag = "WsDisconnected";

    static {
        this.prototype.name = "WsDisconnected";
    }
}

const startWsCommunication = (
    ws: WebSocket,
    messagesToSend: Queue.Dequeue<SendMessage>,
    receivedMessages: PubSub.PubSub<ReceivedMessage>
) =>
    Effect.async<never, FailedToConnectWs | WsDisconnected>((resume) => {
        const timeout = setTimeout(() => {
            resume(Effect.fail(new FailedToConnectWs()));
        }, WS_CONNECTION_TIMEOUT);

        let fiber: Fiber.RuntimeFiber<never> | null = null;

        const onOpen = () => {
            clearTimeout(timeout);

            fiber = Effect.runFork(createMessageSender(messagesToSend, ws));
        };

        const onMessage = (event: MessageEvent) =>
            handleWebSocketMessage(event, receivedMessages);

        const cleanup = Effect.gen(function* () {
            clearTimeout(timeout);

            ws.removeEventListener("open", onOpen);
            ws.removeEventListener("message", onMessage);
            ws.removeEventListener("close", onClose);
            ws.removeEventListener("error", onError);

            if (fiber !== null) yield* Fiber.interrupt(fiber);

            ws.close();
        });

        const onClose = () => {
            resume(
                Effect.gen(function* () {
                    yield* cleanup;
                    return yield* Effect.fail(new WsDisconnected());
                })
            );
        };

        const onError = () => {
            resume(
                Effect.gen(function* () {
                    yield* cleanup;
                    return yield* Effect.fail(new FailedToConnectWs());
                })
            );
        };

        ws.addEventListener("open", onOpen);
        ws.addEventListener("message", onMessage);
        ws.addEventListener("close", onClose);
        ws.addEventListener("error", onError);
    });

const createWebSocketConnection = (
    url: string,
    messagesToSend: Queue.Dequeue<SendMessage>,
    messagesToReceive: PubSub.PubSub<ReceivedMessage>
) =>
    Effect.gen(function* () {
        const ws = yield* Effect.try(() => new WebSocket(url)).pipe(
            Effect.orDie
        );

        yield* startWsCommunication(ws, messagesToSend, messagesToReceive).pipe(
            Effect.tapError((cause) => Console.warn(cause))
        );
    }).pipe(Effect.retry(Schedule.exponential("1 second")), Effect.orDie);

export class ChatConnection {
    #messagesToSend: Queue.Queue<SendMessage>;
    #fiber: Fiber.RuntimeFiber<void>;

    constructor(url: string, onMessage: (msg: ReceivedMessage) => void) {
        this.#messagesToSend = Effect.runSync(Queue.unbounded<SendMessage>());
        const messagesToSend = this.#messagesToSend;

        const program = Effect.gen(function* () {
            const receivedMessages = yield* PubSub.unbounded<ReceivedMessage>();

            const wsFiber = Effect.runFork(
                createWebSocketConnection(url, messagesToSend, receivedMessages)
            );

            const messageReceiverFiber = Effect.runFork(
                Effect.scoped(
                    Effect.gen(function* () {
                        const queue = yield* receivedMessages.subscribe;

                        yield* Effect.forever(
                            Effect.gen(function* () {
                                const msg = yield* Queue.take(queue);
                                onMessage(msg);
                            })
                        );
                    })
                )
            );

            yield* Fiber.joinAll([wsFiber, messageReceiverFiber]);
        });

        this.#fiber = Effect.runFork(program);
    }

    sendMessage(msg: SendMessage) {
        Effect.runSync(Queue.offer(this.#messagesToSend, msg));
    }

    async interrupt(): Promise<Exit.Exit<void>> {
        return await Effect.runPromise(Fiber.interrupt(this.#fiber));
    }
}
