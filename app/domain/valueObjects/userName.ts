import { type Result, err, ok } from 'neverthrow';

import type { Brand } from '~/utils/brand';

export type UserName = string & Brand<'userName'>;

export namespace UserName {
    export type Err =
        | 'user_name.invalid_char'
        | 'user_name.too_short'
        | 'user_name.too_long';

    export const create = (rawUserName: string): Result<UserName, Err[]> => {
        const errors: Err[] = [];

        const chars = Array.from(rawUserName);

        if (chars.length < 5) {
            errors.push('user_name.too_short');
        } else if (chars.length > 15) {
            errors.push('user_name.too_long');
        }

        if (!rawUserName.match(/^[0-9A-Za-z_]+$/)) {
            errors.push('user_name.invalid_char');
        }

        return errors.length > 0 ? err(errors) : ok(rawUserName as UserName);
    };

    export const equals = (a: UserName, b: UserName) => a === b;
}
