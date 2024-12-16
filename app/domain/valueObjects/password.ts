import { type Result, err, ok } from 'neverthrow';

import type { Branded } from '~/utils/brand';

export type Password = Branded<string, 'password'>;

export namespace Password {
    export type Err =
        | 'password.invalid_char'
        | 'password.too_short'
        | 'password.too_long';

    export const create = (rawPassword: string): Result<Password, Err[]> => {
        const chars = Array.from(rawPassword);

        const errors: Err[] = [
            ...(chars.length < 10 ? (['password.too_short'] as const) : []),
            ...(chars.length > 40 ? (['password.too_long'] as const) : []),
            ...(rawPassword.match(/^[\x21-\x7e]+$/)
                ? []
                : (['password.invalid_char'] as const)),
        ];

        return errors.length > 0 ? err(errors) : ok(rawPassword as Password);
    };

    export const equals = (a: Password, b: Password) => a === b;
}
