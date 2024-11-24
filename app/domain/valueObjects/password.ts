import { type Result, err, ok } from 'neverthrow';

import type { Brand } from '~/utils/brand';

export type Password = string & Brand<'password'>;

export namespace Password {
    export type Err = 'password.too_short' | 'password.too_long';

    export const create = (password: string): Result<Password, Err[]> => {
        const chars = Array.from(password);

        const errors: Err[] = [];

        if (chars.length < 10) {
            errors.push('password.too_short');
        } else if (chars.length > 70) {
            errors.push('password.too_long');
        }

        if (errors.length > 0) {
            return err(errors);
        }

        return ok(password as Password);
    };
}
