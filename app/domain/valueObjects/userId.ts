import { type Result, ok, err } from 'neverthrow';
import * as uuid from 'uuid';

import type { Brand } from '~/utils/brand';

export type UserId = string & Brand<'userId'>;

export namespace UserId {
    export type Err = 'invalid_user_id';

    export const create = (rawUserId: string): Result<UserId, Err> =>
        uuid.validate(rawUserId)
            ? ok(rawUserId as UserId)
            : err('invalid_user_id');

    export const equals = (a: UserId, b: UserId) => a === b;
}
