import { Schema } from "effect";

export const ReceivedMessage = Schema.Struct({
    id: Schema.String,
    name: Schema.String,
    content: Schema.String,
});

export type ReceivedMessage = Schema.Schema.Type<typeof ReceivedMessage>;

export type SendMessage = Readonly<{
    name: string;
    content: string;
}>;
