import { Either, Option, ParseResult, Schema } from "effect";
import React, { useCallback, useRef, useState, useTransition } from "react";

import { useChatConnection } from "~/chat/useChatConnection";
import { SubmitButton } from "~/components/SubmitButton";
import { Timeline } from "~/components/Timeline";
import { Message } from "~/model/message";

import type { Route } from "./+types/_index";

export const loader = ({ context }: Route.LoaderArgs) => {
    return {
        backendHost: context.cloudflare.env.BACKEND_HOST,
    };
};

export const meta: Route.MetaFunction = () => [{ title: "言娘" }];

type FieldErrors = {
    name: Option.Option<string>;
    content: Option.Option<string>;
};

const getFieldErrors = (parseError: ParseResult.ParseError): FieldErrors => {
    const errors = ParseResult.ArrayFormatter.formatErrorSync(parseError);

    const name = Option.fromNullable(
        errors.find(
            (error) =>
                Array.isArray(error.path) &&
                error.path.length === 1 &&
                error.path[0] === "name"
        )
    ).pipe(Option.map((error) => error.message));

    const content = Option.fromNullable(
        errors.find(
            (error) =>
                Array.isArray(error.path) &&
                error.path.length === 1 &&
                error.path[0] === "content"
        )
    ).pipe(Option.map((error) => error.message));

    return { name, content };
};

const validateMessageToSend = ({
    name,
    content,
}: {
    name: unknown;
    content: unknown;
}): Either.Either<Message, FieldErrors> =>
    Schema.decodeUnknownEither(Message)(
        {
            name,
            content,
        },
        {
            errors: "all",
        }
    ).pipe(Either.mapLeft(getFieldErrors));

const SubmitButtonMemo = React.memo(SubmitButton);

export default function Ws({
    loaderData: { backendHost },
}: Route.ComponentProps) {
    const [, startTransition] = useTransition();

    const timelineRef = useRef<HTMLUListElement | null>(null);
    const timelineEndRef = useRef<HTMLDivElement | null>(null);

    const nameInputRef = useRef<HTMLInputElement | null>(null);
    const contentInputRef = useRef<HTMLTextAreaElement | null>(null);

    // const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

    const shouldAutoScrollRef = useRef(true);

    const [autoScroll, setAutoScroll] = useState(true);

    const [errors, setErrors] = useState<FieldErrors>({
        name: Option.none(),
        content: Option.none(),
    });

    const { messages, sendMessage } = useChatConnection({
        backendHost,
        onMessageReceived: () => {
            setTimeout(() => {
                if (shouldAutoScrollRef.current) {
                    timelineEndRef.current?.scrollIntoView({
                        behavior: "smooth",
                    });
                }
            }, 100);
        },
        onMessageSent: () => {
            if (contentInputRef.current !== null) {
                contentInputRef.current.value = "";
            }
        },
    });

    const handleSubmit = useCallback((formData: FormData) => {
        const draftMessage = {
            name: formData.get("name"),
            content: formData.get("content"),
        };

        const validationResult = validateMessageToSend(draftMessage);

        if (Either.isLeft(validationResult)) {
            setErrors(validationResult.left);
            return;
        }

        const message = validationResult.right;

        sendMessage({
            name: message.name,
            content: message.content,
        });
    }, []);

    const handleNameKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }, []);

    const handleContentKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.ctrlKey && e.key === "Enter") {
                e.preventDefault();
                const form = e.currentTarget.form!;
                form.requestSubmit();
            }
        },
        []
    );

    const handleUserScroll = () => {
        if (timelineRef.current === null) return;

        // timelineRef, timelineEndRef の交差を監視する
    };

    const scrollToBottom = () => {
        if (timelineEndRef.current === null) return;

        timelineEndRef.current.scrollIntoView({
            behavior: "smooth",
        });

        shouldAutoScrollRef.current = true;

        startTransition(() => {
            setAutoScroll(true);
        });
    };

    return (
        <main className="mx-auto max-w-2xl h-dvh flex flex-col">
            <Timeline
                ref={timelineRef}
                timelineEndRef={timelineEndRef}
                messages={messages}
                autoScroll={autoScroll}
                handleUserScroll={handleUserScroll}
                scrollToBottom={scrollToBottom}
            />

            <form
                className="p-2 flex flex-col bg-gray-100"
                action={handleSubmit}
            >
                <input
                    type="text"
                    name="name"
                    minLength={5}
                    maxLength={20}
                    required
                    placeholder="请输入你的用户名"
                    className="py-1 px-2 bg-white border border-gray-300 rounded-md"
                    ref={nameInputRef}
                    onKeyDown={handleNameKeyDown}
                />
                <div className="flex gap-2 items-center mt-2">
                    <div className="flex-1 min-w-0">
                        <textarea
                            name="content"
                            minLength={1}
                            maxLength={1000}
                            required
                            placeholder="请输入本文 (按Ctrl + Enter发送)"
                            className="w-full px-2 py-1 resize-none bg-white rounded-md border border-gray-300"
                            ref={contentInputRef}
                            onKeyDown={handleContentKeyDown}
                        />
                    </div>
                    <SubmitButtonMemo />
                </div>
            </form>
        </main>
    );
}
