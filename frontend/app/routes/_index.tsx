import React, { useCallback, useEffect, useRef, useState } from "react";

import { Route } from "./+types/_index";

export const meta: Route.MetaFunction = () => [{ title: "言娘" }];

export const loader = ({ context }: Route.LoaderArgs) => {
    return {
        backendHost: context.cloudflare.env.BACKEND_HOST,
    };
};

type ChatMessage = Readonly<{
    id: string;
    name: string;
    content: string;
}>;

export default function Index({
    loaderData: { backendHost },
}: Route.ComponentProps) {
    const [name, setName] = useState("");
    const [talkHistory, setTalkHistory] = useState<ChatMessage[]>([]);

    const socketRef = useRef<WebSocket | null>(null);

    const onSubmit = useCallback(async (formData: FormData) => {
        if (socketRef.current === null) return;

        const name = formData.get("name") as string;
        const message = formData.get("message") as string;

        socketRef.current.send(JSON.stringify({ name, message }));
    }, []);

    const onChangeName = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
        },
        [name]
    );

    useEffect(() => {
        const socket = new WebSocket(`wss://${backendHost}/ws`);

        socketRef.current = socket;

        socket.addEventListener("message", (event) => {
            const historyItem = JSON.parse(event.data) as {
                id: string;
                name: string;
                content: string;
            };

            setTalkHistory((prev) => [historyItem, ...prev]);
        });

        return () => {
            socket.close();
        };
    }, []);

    return (
        <main className="px-4 py-2">
            <h1 className="text-2xl">Simple Chat</h1>
            <form
                action={onSubmit}
                className="my-2 flex flex-col px-4 bg-gray-100 border border-gray-300 rounded-md"
            >
                <label className="mt-3">
                    名前：
                    <input
                        type="text"
                        name="name"
                        required
                        max={20}
                        className="py-1 px-2 bg-white border border-gray-300 rounded-md"
                        value={name}
                        onChange={onChangeName}
                    />
                </label>
                <label className="mt-3">
                    本文：
                    <input
                        type="text"
                        name="message"
                        required
                        max={140}
                        className="py-1 px-2 bg-white border border-gray-300 rounded-md"
                    />
                </label>
                <button
                    type="submit"
                    className="mt-3 mb-2 py-1 max-w-[120px] bg-cyan-600 text-white rounded-md"
                >
                    送信
                </button>
            </form>
            <ul>
                {talkHistory.map(({ id, name, content }) => (
                    <li
                        className="mt-2 px-2 py-2 border rounded-md border-gray-300 w-fit"
                        key={id}
                    >
                        <div className="text-gray-700">{name}</div>
                        <div>{content}</div>
                    </li>
                ))}
            </ul>
        </main>
    );
}
