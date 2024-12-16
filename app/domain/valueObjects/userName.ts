import { type Result, err, ok } from 'neverthrow';

import type { Branded } from '~/utils/brand';

export type UserName = Branded<string, 'userName'>;

export namespace UserName {
    export type Err =
        | 'user_name.invalid_char'
        | 'user_name.too_long'
        | 'user_name.too_short';

    export const create = (rawUserName: string): Result<UserName, Err[]> => {
        const chars = Array.from(rawUserName);

        const errors: Err[] = [
            ...(chars.length < 5 ? (['user_name.too_short'] as const) : []),
            ...(chars.length > 15 ? (['user_name.too_long'] as const) : []),
            ...(rawUserName.match(/^[a-zA-Z0-9_]+$/)
                ? []
                : (['user_name.invalid_char'] as const)),
        ];

        return errors.length > 0 ? err(errors) : ok(rawUserName as UserName);
    };

    export const equals = (a: UserName, b: UserName) => a === b;
}
