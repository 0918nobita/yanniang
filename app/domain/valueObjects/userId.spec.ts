import { err, ok } from 'neverthrow';
import { expect, test } from 'vitest';

import { UserId } from './userId';

test('userId', () => {
    expect(UserId.create('')).toEqual(err('invalid_user_id'));

    expect(UserId.create('foo')).toEqual(err('invalid_user_id'));

    expect(UserId.create('0193671c-729a-767e-a2ef-f8056950a7be')).toEqual(
        ok('0193671c-729a-767e-a2ef-f8056950a7be'),
    );
});
