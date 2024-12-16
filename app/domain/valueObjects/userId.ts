import { type Result, err, ok } from 'neverthrow';
import * as uuid from 'uuid';

import type { Branded } from '~/utils/brand';

export type UserId = Branded<string, 'userId'>;

export namespace UserId {
    export type Err = 'user_id.invalid';

    export const create = (rawUserId: string): Result<UserId, Err> =>
        uuid.validate(rawUserId)
            ? ok(rawUserId as UserId)
            : err('user_id.invalid');

    export const equals = (a: UserId, b: UserId) => a === b;
}
