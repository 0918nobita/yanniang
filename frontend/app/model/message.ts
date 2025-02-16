import { Schema } from "effect";

import { Name } from "./name";

const Content = Schema.String.pipe(
    Schema.minLength(1),
    Schema.maxLength(1000)
).annotations({
    message: () => ({
        override: true,
        message:
            "Content must be at least 1 character and at most 1000 characters",
    }),
});

export const Message = Schema.Struct({
    name: Name,
    content: Content,
});

export type Message = Schema.Schema.Type<typeof Message>;
