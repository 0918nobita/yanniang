import { useEffect, useRef, useState, useTransition } from "react";

import { Message } from "~/model/message";

import { ChatConnection } from "./chatConnection";
import { ReceivedMessage } from "./types";

export const useChatConnection = ({
    backendHost,
    onMessageReceived,
    onMessageSent,
}: {
    backendHost: string;
    onMessageReceived: () => void;
    onMessageSent: () => void;
}) => {
    const chatConnection = useRef<ChatConnection | null>(null);

    const [, startTransition] = useTransition();

    const [messages, setMessages] = useState<ReceivedMessage[]>([]);

    const sendMessage = (message: Message) => {
        if (chatConnection.current === null) return;

        chatConnection.current.sendMessage({
            name: message.name,
            content: message.content,
        });

        onMessageSent();
    };

    useEffect(() => {
        const conn = new ChatConnection(
            import.meta.env.PROD
                ? `wss://${backendHost}/ws`
                : `ws://${backendHost}/ws`,
            (msg) => {
                startTransition(() => {
                    setMessages((prev) => [...prev, msg]);
                });

                onMessageReceived();
            }
        );

        chatConnection.current = conn;

        return () => {
            void conn.interrupt();
        };
    }, []);

    return { messages, sendMessage };
};
