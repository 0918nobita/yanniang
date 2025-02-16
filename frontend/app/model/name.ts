import { Schema } from "effect";

export const Name = Schema.NonEmptyTrimmedString.pipe(
    Schema.minLength(5),
    Schema.maxLength(20)
).annotations({
    message: () => ({
        override: true,
        message: "Name must be at least 5 characters and at most 20 characters",
    }),
});

export type Name = Schema.Schema.Type<typeof Name>;
